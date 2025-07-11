import tkinter as tk
from tkinter import messagebox, ttk
import requests
import threading
import time
import socket

API_URL = 'http://10.100.6.123:3000'

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Мое приложение")
        self.token = None

        self.create_login_frame()

    def create_login_frame(self):
        self.login_frame = tk.Frame(self.root)
        self.login_frame.pack(padx=20, pady=20)

        tk.Label(self.login_frame, text="Логин:").grid(row=0, column=0, sticky='e')
        tk.Label(self.login_frame, text="Пароль:").grid(row=1, column=0, sticky='e')

        self.entry_username = tk.Entry(self.login_frame)
        self.entry_password = tk.Entry(self.login_frame, show='*')

        self.entry_username.grid(row=0, column=1)
        self.entry_password.grid(row=1, column=1)

        login_button = tk.Button(self.login_frame, text="Войти", command=self.attempt_login)
        login_button.grid(row=2, columnspan=2, pady=10)

    def attempt_login(self):
        username = self.entry_username.get()
        password = self.entry_password.get()

        try:
            response = requests.post(f'{API_URL}/api/login-with-password', json={
                'username': username,
                'password': password
            })
            if response.status_code == 200:
                data = response.json()
                self.token = data['token']
                messagebox.showinfo("Успех", "Авторизация прошла успешно")
                self.show_main_interface()
            else:
                messagebox.showerror("Ошибка", f"Ошибка авторизации: {response.text}")
        except Exception as e:
            messagebox.showerror("Ошибка", f"Ошибка соединения: {e}")

    def show_main_interface(self):
        self.login_frame.destroy()

        self.main_frame = tk.Frame(self.root)
        self.main_frame.pack(padx=20, pady=20)

        # Кнопка обновления списка агентов
        refresh_agents_btn = tk.Button(self.main_frame, text="Обновить список агентов", command=self.update_agents_list)
        refresh_agents_btn.pack()

        # Таблица с агентами
        columns = ('hostname', 'status')
        self.agents_tree = ttk.Treeview(self.main_frame, columns=columns, show='headings', selectmode='browse')
        self.agents_tree.heading('hostname', text='Имя компьютера')
        self.agents_tree.heading('status', text='Статус')
        self.agents_tree.pack(pady=10)

        # Кнопка отправки команды выбранному агенту
        command_frame = tk.LabelFrame(self.main_frame, text="Отправить команду выбранному агенту")
        command_frame.pack(pady=10)

        self.command_var = tk.StringVar()
        commands_list = ['shutdown', 'restart', 'lock', 'custom']
        self.command_menu = ttk.Combobox(command_frame, textvariable=self.command_var)
        self.command_menu['values'] = commands_list
        self.command_menu.current(0)
        self.command_menu.pack(side='left', padx=5)

        self.custom_command_entry = tk.Entry(command_frame)
        self.custom_command_entry.pack(side='left', padx=5)

        send_command_btn = tk.Button(command_frame, text="Отправить команду", command=self.send_command_to_selected_agent)
        send_command_btn.pack(side='left', padx=5)

        # Запускаем фоновый поток для периодического обновления данных
        threading.Thread(target=self.background_task, daemon=True).start()

    def update_agents_list(self):
        """Запросить список всех агентов и обновить таблицу"""
        
        headers = {'Authorization': f'Bearer {self.token}'} if hasattr(self, 'token') and self.token else {}
        
        try:
            response = requests.get(f'{API_URL}/api/agents', headers=headers)
            if response.status_code == 200:
                agents_list = response.json()  # Предполагается список dict с ключами 'hostname' и 'status'
                import pprint
                pprint.pprint(agents_list)
                # Очистка таблицы
                for item in self.agents_tree.get_children():
                    self.agents_tree.delete(item)
                # Заполнение таблицы новыми данными
                for hostname in agents_list:
                    status_ = ('status', 'неизвестен')
                    self.agents_tree.insert('', 'end', values=(hostname, status_))
            else:
                messagebox.showerror("Ошибка", f"Не удалось получить список агентов: {response.text}")
        
        except Exception as e:
            messagebox.showerror("Ошибка", f"Ошибка соединения: {e}")

    def send_command_to_selected_agent(self):
        selected_item = self.agents_tree.selection()
        
        if not selected_item:
            messagebox.showwarning("Внимание", "Выберите агента из списка")
            return
        
        hostname_item = self.agents_tree.item(selected_item)
        
        hostname = hostname_item['values'][0]
        
        command_type = self.command_var.get()
        
        if command_type == 'custom':
            command_value = self.custom_command_entry.get().strip()
            if not command_value:
                messagebox.showwarning("Внимание", "Введите команду")
                return
            payload_command_type = command_value
            is_custom_flag = True
            target_hostname = hostname  # Отправляем конкретному агенту по имени
            try:
                response = requests.post(f'{API_URL}/api/send-command', json={
                    'command_type': payload_command_type,
                    'is_custom': is_custom_flag,
                    'hostname': target_hostname
                }, headers={'Authorization': f'Bearer {self.token}'})
                
                if response.status_code == 200:
                    messagebox.showinfo("Успех", "Команда отправлена успешно")
                else:
                    messagebox.showerror("Ошибка", f"Ошибка при отправке команды: {response.text}")
            except Exception as e:
                messagebox.showerror("Ошибка", f"Ошибка соединения: {e}")
        
        else:
            # Стандартные команды без кастомных данных
            target_hostname = hostname  # Отправляем конкретному агенту по имени
            
            try:
                response = requests.post(f'{API_URL}/api/send-command', json={
                    'command_type': command_type,
                    'is_custom': False,
                    'hostname': target_hostname
                }, headers={'Authorization': f'Bearer {self.token}'})
                
                if response.status_code == 200:
                    messagebox.showinfo("Успех", "Команда отправлена успешно")
                else:
                    messagebox.showerror("Ошибка", f"Ошибка при отправке команды: {response.text}")
            except Exception as e:
                messagebox.showerror("Ошибка", f"Ошибка соединения: {e}")

    def background_task(self):
       while True:
           if hasattr(self, 'token') and self.token:
               # Обновляем статус выбранного агента или всех по необходимости.
               # Можно расширить по желанию.
               time.sleep(60)  # каждые 60 секунд

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()