# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"


# host machine configuration
HOST_VAGRANT      = "."
HOST_WORKSPACE    = ENV["HOST_WORKSPACE_FOLDER"]  || "/Users/Shared/vagrant/"

# virtual machine configuration
GUEST_VAGRANT     = "/vagrant"
GUEST_BASE_IP     = ENV["GUEST_BASE_IP"]          || "192.168.50."
GUEST_MAC         = ENV["GUEST_MAC"]              || "255.255.255.0"

# kafka configuration
KAFKA_MEMSIZE     = ENV["KAFKA_MEMORY"]           || 1024
KAFKA_CPU         = ENV["KAFKA_CPUS"]             || 2
KAFKA_HOST        = ENV["KAFKA_HOST"]             || "kafka"
KAFKA_IP          = ENV["KAFKA_IP"]               || "100"

# swarm configuration
SWARM_MANAGERS    = ENV["SWARM_MANAGERS"]         || 1
SWARM_WORKERS     = ENV["SWARM_WORKERS"]          || 2
SWARM_MANAGER_IP  = ENV["SWARM_MANAGER_IP"]       || "20"
SWARM_WORKER_IP   = ENV["SWARM_WORKER_IP"]        || "21"
SWARM_NODES       = {
  "manager" => [SWARM_MANAGERS, SWARM_MANAGER_IP, 1, 512],
  "worker"  => [SWARM_WORKERS, SWARM_WORKER_IP, 1, 512]
}

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "allanchau/xenial64"

  # configure vagrant-timezone plugin
  if Vagrant.has_plugin?("vagrant-timezone")
    config.timezone.value = :host
  end

  # configure vagrant-gatling-rsync plugin
  if Vagrant.has_plugin?("vagrant-gatling-rsync")
    config.gatling.latency          = 0.4
    config.gatling.time_format      = "%H:%M:%S"
    config.gatling.rsync_on_startup = true
  end

  config.vm.synced_folder HOST_VAGRANT, GUEST_VAGRANT

  # configure ssh access with private key
  config.ssh.insert_key = false
  config.ssh.private_key_path = ["keys/sshkey", "~/.vagrant.d/insecure_private_key"]
  config.vm.provision "file", source: "keys/sshkey.pub", destination: "~/.ssh/authorized_keys"
  config.vm.provision "shell", inline: <<-EOC
    sudo sed -i -e "\\#PasswordAuthentication yes# s#PasswordAuthentication yes#PasswordAuthentication no#g" /etc/ssh/sshd_config
    sudo service ssh restart
  EOC

  config.vm.define KAFKA_HOST do |kafka|
    kafka.vm.synced_folder HOST_WORKSPACE + KAFKA_HOST + "/", "/workspace"

    kafka.vm.provider :virtualbox do |vb, override|
      override.vm.network :private_network, ip: GUEST_BASE_IP + KAFKA_IP, :netmask => GUEST_MAC
      override.vm.hostname  = KAFKA_HOST
      vb.name               = KAFKA_HOST
      vb.memory             = KAFKA_MEMSIZE
      vb.cpus               = KAFKA_CPU
    end

    # update hosts file
    kafka.vm.provision :hosts, :sync_hosts => true

  end

  SWARM_NODES.each do |prefix, (count, ip_start, vcpu, vmem)|
    count.times do |i|
      hostname  = prefix        + "#{i+1}"
      hostip    = GUEST_BASE_IP + ip_start  + "#{i+1}"

      config.vm.define "#{hostname}" do |swarm|
        swarm.vm.synced_folder HOST_WORKSPACE + "#{hostname}/", "/workspace"

        swarm.vm.provider :virtualbox do |vb, override|
          override.vm.network :private_network, ip: hostip, :netmask => GUEST_MAC
          override.vm.hostname  = "#{hostname}"
          vb.name               = "#{hostname}"
          vb.memory             = vmem
          vb.cpus               = vcpu
        end

        # update hosts file
        swarm.vm.provision :hosts, :sync_hosts => true

        # only call if is the primary manager
        if (hostname == 'manager1')
          # only call if --provision-with ansible_local is on command line
          if  ARGV.include? '--provision-with'
            swarm.vm.provision :ansible_local do |playbook|
              playbook.install            = true
              playbook.limit              = "all"
              playbook.config_file        = "ansible.cfg"
              playbook.playbook           = "provisioning/site.yml"
              playbook.inventory_path     = "provisioning/hosts"
            end
          end
        end

      end
    end
  end

end
