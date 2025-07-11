#!/bin/bash
# Устанавливаем правильные права на SSL-ключ
chmod 600 /etc/ssl/postgresql/server.key
chown postgres:postgres /etc/ssl/postgresql/server.key

# Применяем SSL-настройки
echo "ssl = on" >> $PGDATA/postgresql.conf
echo "ssl_cert_file = '/etc/ssl/postgresql/server.crt'" >> $PGDATA/postgresql.conf
echo "ssl_key_file = '/etc/ssl/postgresql/server.key'" >> $PGDATA/postgresql.conf
