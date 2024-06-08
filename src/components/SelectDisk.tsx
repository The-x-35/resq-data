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
  onDiskSelect: (deviceNode: string) => void;
}

const SelectDisk: React.FC<SelectDiskProps> = ({ onDiskSelect }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [diskInfo, setDiskInfo] = useState<DiskInfo[]>([]);
  const [filteredDiskInfo, setFilteredDiskInfo] = useState<DiskInfo[]>([]);
  const [selectedDisk, setSelectedDisk] = useState<string | null>(null);
  const [selectedVolumeName, setSelectedVolumeName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
        onDiskSelect(selectedDisk);
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
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default SelectDisk;
