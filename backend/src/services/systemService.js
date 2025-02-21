const si = require('systeminformation');

const getSystemMetrics = async () => {
  const [cpu, mem, osInfo, disk, load, cpuTemp, network, processes] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.osInfo(),
    si.fsSize(),
    si.currentLoad(),
    si.cpuTemperature(),
    si.networkInterfaces(),
    si.processes(),
  ]);

  return {
    cpu: {
      model: cpu.manufacturer + ' ' + cpu.brand,
      speed: (cpu.speedMax * (load.currentLoad / 100)).toFixed(2), // Real-time speed
      cores: cpu.cores,
      architecture: osInfo.arch,
      load: load.currentLoad.toFixed(2), // CPU load percentage
      temp: cpuTemp.main ? cpuTemp.main + ' °C' : 'N/A', // CPU temperature
      speedPerCore: load.cpus.map((core, index) => ({
        core: index + 1,
        load: core.load.toFixed(2) + ' %',
        speed: core.speed + ' GHz',
      })),
    },
    memory: {
      total: (mem.total / (1024 ** 3)).toFixed(2),  // GB
      used: ((mem.total - mem.available) / (1024 ** 3)).toFixed(2),  // GB
      available: (mem.available / (1024 ** 3)).toFixed(2), // GB
      usage: ((100 * (mem.total - mem.available) / mem.total)).toFixed(2) + ' %',
    },
    os: {
      platform: osInfo.platform,
      distro: osInfo.distro,
      release: osInfo.release,
    },
    disk: disk.map(d => ({
      filesystem: d.fs,
      size: (d.size / (1024 ** 3)).toFixed(2),  // GB
      used: (d.used / (1024 ** 3)).toFixed(2),  // GB
      available: ((d.size - d.used) / (1024 ** 3)).toFixed(2), // GB
      usage: ((100 * d.used / d.size)).toFixed(2) + ' %',
      mount: d.mount,
    })),
    network: network.map(n => ({
      iface: n.iface,
      ip4: n.ip4,
      mac: n.mac,
      speed: n.speed ? n.speed + ' Mbps' : 'N/A',
      internal: n.internal,
    })),
    processes: {
      total: processes.all,
      running: processes.running,
      list: processes.list.slice(0, 5).map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: p.cpu.toFixed(2) + ' %',
        memory: p.mem.toFixed(2) + ' %',
        user: p.user,
      })),
    }
  };
};

module.exports = { getSystemMetrics };
