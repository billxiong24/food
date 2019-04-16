git status
sudo -u vcm git pull
# NODE=$(sudo netstat -lp > update.py)
# sudo kill "$NODE"
# sudo node app.js
sleep 1
sudo netstat -lp
sudo netstat -lp | python update.py
NODE=$(sudo netstat -lp | python update.py)
echo $NODE
echo $NODE
echo $NODE
sudo kill $NODE
sudo node app.js
