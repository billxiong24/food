git status
sudo -u vcm git pull
# NODE=$(sudo netstat -lp > update.py)
# sudo kill "$NODE"
# sudo node app.js
NODE=$(sudo netstat -lp | python update.py)
echo $NODE
