import requests
import time
import os
import socket

API_URL = 'http://10.100.6.123:3000'
HOSTNAME = socket.gethostname()

def register_computer():
    """Регистрируем компьютер в базе данных, если его там нет"""
    response = requests.post(f'{API_URL}/api/computer/register', json={'hostname': HOSTNAME})
    if response.status_code == 200:
        print("Компьютер зарегистрирован")
    else:
        print("Ошибка регистрации:", response.text)

def get_status():
    response = requests.get(f'{API_URL}/api/computer/{HOSTNAME}/status')
    if response.status_code == 200:
        return response.json()
    else:
        print('Ошибка получения статуса:', response.text)
        return None

def get_command():
    """Запросить текущие команды для этого компьютера"""
    try:
        response = requests.get(f'{API_URL}/api/computer/{HOSTNAME}/commands')
        if response.status_code == 200:
            return response.json()
        else:
            print('Ошибка получения команды:', response.text)
            return None
    except Exception as e:
        print('Ошибка при запросе команды:', e)
        return None

def send_command_result(command_id, status):
    """Отправить результат выполнения команды"""
    try:
        response = requests.post(
            f'{API_URL}/api/commands/{command_id}/result',
            json={'status': status}
        )
        if response.status_code == 200:
            print('Результат отправлен успешно')
        else:
            print('Ошибка при отправке результата:', response.text)
    except Exception as e:
        print('Ошибка при отправке результата:', e)

def perform_shutdown():
    """Выполнить выключение системы"""
    print("Выполняется выключение системы...")
    os.system('shutdown /s /t 1')
    
def perform_restart():
    """Перезагрузить систему"""
    print("Выполняется перезагрузка системы...")
    os.system('shutdown /r /t 1')

def perform_lock():
    """Заблокировать экран"""
    print("Экран блокируется...")
    os.system('rundll32.exe user32.dll,LockWorkStation')

if __name__ == '__main__':
    # Регистрация компьютера при старте
    register_computer()

    while True:
        # Получаем статус (можно расширить по необходимости)
        status_response = get_status()

        # Получаем команду для выполнения
        command_info = get_command()

        if command_info and 'command_id' in command_info and 'command_type' in command_info:
            command_id = command_info['command_id']
            command_type = command_info['command_type']
            command_status = command_info.get('status', 'pending')

            if command_status == 'pending':
                if command_type == 'shutdown':
                    # Выполняем команду
                    perform_shutdown()
                    # Отправляем результат
                    send_command_result(command_id, 'completed')
                else:
                    print(f"Неизвестная команда: {command_type}")
                    send_command_result(command_id, 'unknown_command')
        
        time.sleep(30)