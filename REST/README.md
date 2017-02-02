


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

Даллее без коментариев:
```
$geth attach
>personal.newAccount("secret")
>eth.accounts[0]
>eth.getBalance(eth.accounts[0])
>personal.unlockAccount(eth.accounts[0], 'secret', 30000)
```
Тут нужна ссылка, где скриптом делаем донат и добавляем разрешения для работы с контрактом.

Устанавливаем переменные окруженя для запуска сервера:
```
$export CONTRACT_ADDRESS=0xbd158c546e931c0e5b645825dfe4462a65b3fdcd
$export CERTIFICATE_FILE=server.crt
$export PRIVATE_KEY_FILE=server.key
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
