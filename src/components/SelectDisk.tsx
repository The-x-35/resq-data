import React, { useState, useEffect } from 'react';
import './SelectDisk.css';
import Disk from './ui/disk';
import search from '../../assets/search.png';

interface DiskInfo {
  deviceNode: string;
  volumeName: string;
  mounted: string;
  fileSystemPersonality: string;
  volumeUsedSpace: string;
  diskSize: string;
}

interface SelectDiskProps {
  onDiskSelect: (deviceNode: string, volumeName: string) => void;
}

const SelectDisk: React.FC<SelectDiskProps> = ({ onDiskSelect }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [diskInfo, setDiskInfo] = useState<DiskInfo[]>([]);
  const [filteredDiskInfo, setFilteredDiskInfo] = useState<DiskInfo[]>([]);
  const [selectedDisk, setSelectedDisk] = useState<string | null>(null);
  const [selectedVolumeName, setSelectedVolumeName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [backupInterval, setBackupInterval] = useState<string>('select interval');
  const [nextBackupTime, setNextBackupTime] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const fetchDiskList = async () => {
      try {
        const response = await fetch('http://localhost:5001/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command: 'diskutil list' }),
        });
        const data = await response.json();
        setOutput(data.output.split('\n'));
      } catch (error) {
        console.error('Error fetching disk list', error);
      }
    };

    fetchDiskList();
  }, []);

  useEffect(() => {
    const fetchDiskInfo = async () => {
      try {
        const infoPromises = output.map(line => {
          const matches = line.match(/(disk\d+s\d+)/);
          if (matches && matches.length > 0) {
            const deviceNode = matches[1];
            // Exclude disk0 entries
            if (!deviceNode.includes('disk0')) {
              return fetchDiskDetails(deviceNode);
            }
          }
          return Promise.resolve(null);
        });
        const diskDetails = await Promise.all(infoPromises);
        const uniqueDiskDetails = removeDuplicates(diskDetails.filter(info => info !== null) as DiskInfo[]);
        setDiskInfo(uniqueDiskDetails);
        setFilteredDiskInfo(uniqueDiskDetails); // Initialize the filtered list
      } catch (error) {
        console.error('Error fetching disk info', error);
      }
    };

    fetchDiskInfo();
  }, [output]);

  const fetchDiskDetails = async (deviceNode: string): Promise<DiskInfo | null> => {
    try {
      const response = await fetch('http://localhost:5001/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `diskutil info /dev/${deviceNode}` }),
      });
      const data = await response.json();
      const info = parseDiskInfo(data.output);
      return info;
    } catch (error) {
      console.error('Error fetching disk details', error);
      return null;
    }
  };

  const parseDiskInfo = (output: string): DiskInfo | null => {
    const lines = output.split('\n');
    const diskInfo: Partial<DiskInfo> = {};

    lines.forEach(line => {
      const [key, value] = line.split(':').map(item => item.trim());
      switch (key) {
        case 'Device Node':
          diskInfo.deviceNode = value;
          break;
        case 'Volume Name':
          diskInfo.volumeName = value;
          break;
        case 'Mounted':
          diskInfo.mounted = value;
          break;
        case 'File System Personality':
          diskInfo.fileSystemPersonality = value;
          break;
        case 'Volume Used Space':
          diskInfo.volumeUsedSpace = value.split(' ').slice(0, 2).join(' ');
          break;
        case 'Disk Size':
          diskInfo.diskSize = value.split(' ').slice(0, 2).join(' ');
          break;
        default:
          break;
      }
    });

    if (Object.keys(diskInfo).length === 0) return null;
    return diskInfo as DiskInfo;
  };

  const handleDiskSelect = (deviceNode: string, volumeName: string) => {
    setSelectedDisk(deviceNode);
    setSelectedVolumeName(volumeName);
  };

  const confirmSelection = () => {
    if (selectedDisk && selectedVolumeName) {
      const isConfirmed = window.confirm(`Are you sure you want to select "${selectedVolumeName}" ?`);
      if (isConfirmed) {
        onDiskSelect(selectedDisk, selectedVolumeName);
      } else {
        setSelectedDisk(null);
        setSelectedVolumeName(null);
      }
    }
  };

  const removeDuplicates = (diskDetails: DiskInfo[]): DiskInfo[] => {
    const uniqueDiskDetails = diskDetails.filter((disk, index, self) =>
      index === self.findIndex((d) => d.deviceNode === disk.deviceNode)
    );
    return uniqueDiskDetails;
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const filteredDisks = diskInfo.filter(disk =>
      disk.volumeName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredDiskInfo(filteredDisks);
  };

  const handleBackupSchedule = async () => {
    if (selectedDisk && backupInterval !== 'select interval') {
      const isConfirmed = window.confirm(`Are you sure you want to schedule a backup for "${selectedVolumeName}" (${selectedDisk})?`);
      if (isConfirmed) {
        try {
          const deleteCommand = 'rm -f ../../../disk.img';
          await fetch('http://localhost:5001/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: deleteCommand }),
          });
  
          const backupCommand = `sudo dd if=${selectedDisk} of=../../../disk.img bs=1024k status=progress`;
          await fetch('http://localhost:5001/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: backupCommand }),
          });
  
          setNextBackupTime(`Successfully backing up disk image for ${selectedVolumeName} (${selectedDisk})`);
  
          let interval: number;
          switch (backupInterval) {
            case 'daily':
              interval = 86400; // 24 hours in seconds
              break;
            case 'weekly':
              interval = 604800; // 7 days in seconds
              break;
            case 'monthly':
              interval = 2592000; // 30 days in seconds (approx)
              break;
            case 'quarterly':
              interval = 7776000; // 90 days in seconds (approx)
              break;
            case 'half yearly':
              interval = 15552000; // 180 days in seconds (approx)
              break;
            case 'yearly':
              interval = 31536000; // 365 days in seconds (approx)
              break;
            default:
              interval = 0;
              break;
          }
  
          setTimer(interval);
  
          setInterval(async () => {
            await fetch('http://localhost:5001/execute', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ command: deleteCommand }),
            });
            await fetch('http://localhost:5001/execute', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ command: backupCommand }),
            });
          }, interval * 1000);
  
        } catch (error) {
          console.error('Error scheduling backup', error);
        }
      }
    }
  };
  
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(countdown);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d} days ${h} hours ${m} minutes ${s} seconds`;
  };

  return (
    <div className="select-disk-container">
      <div className="select-disk">
        <div className="input-group">
          <input
            type="search"
            placeholder="Search by volume name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <img src={search} alt="Search" />
        </div>
        <p className='sd-instruction'>Select the disk on which you want to perform the operations.</p>
        {filteredDiskInfo.length > 0 ? (
          <>
            <div className="disk-list">
              {filteredDiskInfo.map((disk, index) => (
                <Disk
                  key={index}
                  deviceNode={disk.deviceNode}
                  volumeName={disk.volumeName}
                  mounted={disk.mounted}
                  fileSystemPersonality={disk.fileSystemPersonality}
                  volumeUsedSpace={disk.volumeUsedSpace}
                  diskSize={disk.diskSize}
                  onClick={() => handleDiskSelect(disk.deviceNode, disk.volumeName)}
                  isSelected={disk.deviceNode === selectedDisk}
                />
              ))}
            </div>
            <button className="button" onClick={confirmSelection} disabled={!selectedDisk}>
              Confirm Selection
            </button>
          </>
        ) : (
          <div className="no-disks-found">No disks found</div>
        )}
      </div>
      <div className="backup-scheduler">
        <h2>Backup Scheduler</h2>
        <div className="scheduler-controls">
          <select value={backupInterval} onChange={(e) => setBackupInterval(e.target.value)} disabled={!selectedDisk}>
            <option value="select interval">Select Interval</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half yearly">Half Yearly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={handleBackupSchedule} disabled={!selectedDisk || backupInterval === 'select interval'}>
            Schedule Backup
          </button>
        </div>
        {nextBackupTime && (
          <div className="next-backup">
            <p>{nextBackupTime}</p>
            {timer > 0 && <p>Next backup in: {formatTime(timer)}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDisk;
