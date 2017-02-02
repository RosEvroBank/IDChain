


#IDentify REST API Sever

REST API сервер обеспечивает простой и удобный интерфейс для работы со смарт-контрактом системы идентификации.
----------


Развертывание REST API сервера
----

Для работы REST сервера необходимо поднять ноду сети Ethereum. Для простоты мы будем использовать Ropsten Test NET. Для поднятия ноды выполним команду:

```
geth --light --rpc --rpcaddr 0.0.0.0 --rpcport 8545 --rpcapi "admin,web3,eth,network,person" --testnet
```
Мы подняли облегченную ноду и RPC сервер с адресом ```http://localhost:8545```

Подключаемся к ноде через консоль ```geth``` и создаём новый аккаунт.
```
$geth attach
>personal.newAccount("secret")
>eth.accounts[0]
```
Для выполнения некоторых функций контракта необходимо иметь положительный баланс в эфирах. Эфир можно намайнить или получить донат. Также, для отправки транзакций необходимо разблокировать аккаунт.
```
>personal.unlockAccount(eth.accounts[0], 'secret', 30000)
>eth.getBalance(eth.accounts[0])
```
> Info
> 
> Делайте разблокировку аккаунта каждый раз, когда получаете ошибку ```Account is locked```


Тут нужна ссылка, где скриптом делаем донат и добавляем разрешения для работы с контрактом.
Для поднятия HTTPS сервера нам нужны сертификат и ключ.
```
$openssl genrsa -des3 -out server.key 1024
$openssl req -new -key server.key -out server.csr
$cp server.key server.key.org
$openssl rsa -in server.key.org -out server.key
$openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
$cp server.crt /usr/local/ssl/ssl.crt
$cp server.key /usr/local/ssl/ssl.key
$rm server.crt
$rm server.key
$rm server.key.org
```
> Warning
>
> Внимательно отнеситесь к безопасности ваших ключей и сертификатов!
> Данный код не обеспечивает должной безопасности.

Устанавливаем переменные окруженя для запуска сервера:
```
$export CONTRACT_ADDRESS=0xbd158c546e931c0e5b645825dfe4462a65b3fdcd
$export CERTIFICATE_FILE=/usr/local/ssl/ssl.crt
$export PRIVATE_KEY_FILE=/usr/local/ssl/ssl.key
$export DEBUG=IDENTIFY
$export rpc_url=http://localhost:8545/
```
Запускаем сервер:
```
$git clone https://github.com/RosEvroBank/Identify.git
$cd Identify/REST
$npm install
$node server.js
```

Или в Microsoft Azure развертываем через Azure Marketplace.
