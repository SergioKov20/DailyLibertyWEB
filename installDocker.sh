# Script amb les comandes per instalar docker compose

# Pregunta pel pass si no està ( tot i això millor executar-ho amb root)
# Només amb sudo funciona
sudo true

# Aquesta part no funcionava
# sudo apt-get -y install linux-image-extra-$(uname -r)

# Afegint ppa i última versió
# sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
# sudo sh -c "echo deb https://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list"
# sudo apt-get update
# sudo apt-get install lxc-docker -y

# Docker oficial
wget -qO- https://get.docker.com/ | sh

# Instala docker-compose
COMPOSE_VERSION=`git ls-remote https://github.com/docker/compose | grep refs/tags | grep -oP "[0-9]+\.[0-9][0-9]+\.[0-9]+$" | tail -n 1`
sudo sh -c "curl -L https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose"
sudo chmod +x /usr/local/bin/docker-compose
sudo sh -c "curl -L https://raw.githubusercontent.com/docker/compose/${COMPOSE_VERSION}/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose"


# Instala docker-cleanup comanda
cd /tmp
git clone https://gist.github.com/76b450a0c986e576e98b.git
cd 76b450a0c986e576e98b
sudo mv docker-cleanup /usr/local/bin/docker-cleanup
sudo chmod +x /usr/local/bin/docker-cleanup


# M'ha donat diversos problemes per la meva versió ubuntu -> segons com potser es necessari fer export de la variable
# export COMPOSE_API_VERSION= aquí aniria la versió per a que sigui igual client de server