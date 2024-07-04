
# ResQ Data

It is an open-source cross-platform data recovery tool based on The Sleuth Kit made in IIT Bombay TrustLab FOSSx Summer of Code.


![Logo](https://raw.githubusercontent.com/The-x-35/resq-data/master/assets/icon.jpg)


## Run Locally

Make sure you have The Sleuth Kit installed.

For Linux
```bash
  sudo apt-get install sleuthkit
```
For MacOS
```bash
  brew install sleuthkit
```

Clone the project

```bash
  git clone https://github.com/The-x-35/resq-data
```

Go to the project directory

```bash
  cd resq-data/
```

Get Sudo access

```bash
  sudo su 
```

Install dependencies

```bash
  npm install
```

To start Development Environment

```bash
  npm run start
```

To build production release

```bash
  npm run build
  npm run package
```

## Future Improvements

- Add windows and Linux support (currently works on MacOS only)

- fix the overflow in y on smalll devices

- sd page % correct unit

- add animation in disk search of disk going and coming


- add search box and make it work
- implement specific icons based on the docs ( https://wiki.sleuthkit.org/index.php?title=Fls )
- add specific icon for each file extension

- in recovery page handle the errors correctly 
- show improved progress bar
- open folder in which files are recovered button 



- add backup scheduler




## Screenshots

![App Screenshot](https://github.com/The-x-35/resq-data/blob/master/assets/ss/Screenshot%202024-06-30%20at%203.01.27%E2%80%AFAM.png?raw=true)

![App Screenshot](https://github.com/The-x-35/resq-data/blob/master/assets/ss/Screenshot%202024-06-30%20at%203.01.43%E2%80%AFAM.png?raw=true)

![App Screenshot](https://github.com/The-x-35/resq-data/blob/master/assets/ss/Screenshot%202024-06-30%20at%203.02.20%E2%80%AFAM.png?raw=true)

![App Screenshot](https://github.com/The-x-35/resq-data/blob/master/assets/ss/Screenshot%202024-06-30%20at%203.03.37%E2%80%AFAM.png?raw=true)

![App Screenshot](https://github.com/The-x-35/resq-data/blob/master/assets/ss/Screenshot%202024-06-30%20at%203.03.57%E2%80%AFAM.png?raw=true)
