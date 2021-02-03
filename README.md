# Case 6 pre-profile olympiad
# Set up
1)Сначало нужно установить docker + docker-compose

[Гайд можно найти здесь](https://docs.docker.com/compose/install/)

2)Теперь переделываем `.env.example` в `.env`

Указываем `MONGO_USER` `MONGO_PASS`

3)Profit
## Linux Usage
### Start
```
sudo docker-compose -f docker-compose.yml up --build -d
```
### Stop
```
sudo docker-compose down
```
### Check
```
sudo docker-compose ps
```
Гугл в помощь для других платформ