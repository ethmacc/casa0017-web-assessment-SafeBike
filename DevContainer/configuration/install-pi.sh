#!/usr/bin/env bash

# Whats my IP
alias myip="ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'"
alias mywifiip="ifconfig wlan0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'"

myip_alias="myip='ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p''"

if ! grep -Fxq "$myip_alias" ~/.bashrc; then
  echo "Alias already exists in .bashrc"
else
  # Append the alias to .bashrc
  echo "$myip_alias" >> ~/.bashrc
  echo "My IP Alias added to .bashrc"
  source ~/.bashrc
fi

# Docker Install
sudo apt-get -y update && sudo apt-get -y upgrade

sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

curl -fsSL test.docker.com -o get-docker.sh && sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

echo -e "Checking USER is in Docker Group"
groups $USER

sudo apt-get install -y libffi-dev libssl-dev
sudo apt install -y python3-dev
sudo apt-get install -y python3 python3-pip

sudo apt-get install -y docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl restart docker

# Install Dockge 
if [[ ! -d /opt/dockge ]]; then
  sudo mkdir -p /opt/stacks /opt/dockge
  sudo chown -R ${USER}:${USER} /opt/stacks /opt/dockge
fi

cd /opt/dockge

curl https://raw.githubusercontent.com/louislam/dockge/master/compose.yaml --output compose.yaml
docker compose up -d

echo "Your Raspberry Pi's IP address is: $(myip)"
echo "SSH is running at: $(myip):22"
echo "Dockge is running at: http://$(myip):8080"

# Back home
cd ~

## To run docker-compose in the devcontainer file on the pi 
# sudo docker-compose -f .devcontainer/docker-compose.yml up --build -d 
# docker exec -it <mycontainer> sh

