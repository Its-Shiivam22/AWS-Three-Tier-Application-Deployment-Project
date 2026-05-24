# 🚀 AWS Three-Tier Web Application Deployment

![AWS](https://img.shields.io/badge/Cloud-AWS-orange)
![Architecture](https://img.shields.io/badge/Architecture-3--Tier-blue)
![Status](https://img.shields.io/badge/Project-Completed-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 **Project Overview**
This project demonstrates the design and deployment of a **scalable and secure three-tier web application architecture on AWS**.  
The architecture separates the application into **Web, Application, and Database layers** to ensure high availability, security, and scalability.

---

## 🏗️ **Architecture Diagram**
<p align="center">
  <img src="./Images/1.Architecture.png" width="800">
</p>

In this architecture, a Internet-facing Application Load Balancer forwards client traffic to our web tier EC2 instances. The web tier is running Nginx webservers that are configured to serve a index.html website and redirects our API calls to the application tier’s internal facing load balancer. The internal facing load balancer then forwards that traffic to the application tier, which is written in Node.js. The application tier manipulates data in an MySQL SIngle Cluster -Free tier database and returns it to our web tier. Load balancing, health checks and autoscaling groups are created at each layer to maintain the availability of this architecture.

---

# 📌 Part 1: Network and Security

## 🌐 Network Architecture

The network architecture in this Project is designed within a custom **Virtual Private Cloud (VPC)** to ensure isolation, scalability, and secure communication between different layers of the application.

The VPC is configured with a CIDR block of **192.168.0.0/16** and deployed in the **ap-south-1 (Mumbai) region**, providing a sufficient IP address range for all resources within the architecture.

To organize resources efficiently, the VPC is divided into **Five subnets** across multiple Availability Zones. This design ensures proper isolation between tiers and enhances overall security.

<h3 align="center">VPC Resource Map</h3>
<p align="center">
  <img src="./Images/2.VPC-ResourceMap.png" width="800">
</p>


- **Public Subnets (2):** Used for the Web Tier instances and Internet-facing Application Load Balancer  
- **Private App Subnets (2):** Used for Application Tier instances and the Internal Load Balancer  
- **Private DB Subnets (1):** Used for the Database layer  

The infrastructure spans across Three Availability Zones:

- **ap-south-1a**  
- **ap-south-1b**  
- **ap-south-1c**

This multi-AZ deployment ensures **high availability, fault tolerance, and resilience** against failures.

---

## 🌍 Internet Connectivity

Internet connectivity is established using AWS-managed networking components to allow controlled access between the application and external users.

## 🌐 Internet Gateway
An **Internet Gateway (IGW)** is attached to the VPC, enabling resources in public subnets to communicate with the internet. 

<h4 align="center">Create Internet Gateway</h4>
<p align="center">
  <img src="./Images/3.Create IGW.png" width="800">
</p>

<h4 align="center">Attach IGW to VPC</h4>
<p align="center">
  <img src="./Images/4.Attach IGW.png" width="800">
</p>

Go to: 
VPC Dashboard → Internet Gateways, create a new IGW by assigning a name, 
& then attach it to your VPC using either the creation prompt or the Actions menu.

Once attached, the VPC can communicate with the internet. 
To fully enable access, ensure the route table for public subnets includes a route (`0.0.0.0/0`) pointing to the Internet Gateway.

---

## 🌐 NAT Gateway
For resources in private subnets, direct internet access is restricted to enhance security. Instead, a **NAT Gateway** is deployed in the public subnet. This allows private instances to initiate outbound internet connections (e.g., for updates or package installations) while blocking inbound traffic from external sources.

<h4 align="center">Create NAT Gateway</h4>
<p align="center">
  <img src="./Images/5.Create NAT.png" width="800">
</p>
<p align="center"> Go to <b>VPC Dashboard → NAT Gateways</b> → Click <b>Create NAT Gateway</b> </p>

<p align="center">
  <img src="./Images/6.NAT Setting.png" width="800">
</p>
<p align="center"> Enter Name for NAT Gateway → Select a <b>Regional Availability</b> →  Inside manual EIP Allocation 
→ Allocate & attach <b>Elastic IP's</b> to Availability Zones → Click <b>Create NAT Gateway</b>
 </p>
 
<p align="center">
  <img src="./Images/7.NAT.png" width="800">
</p>




Regional Availability mode for NAT Gateways, allowing a single NAT gateway to automatically scale across multiple Availability Zones (AZs) without requiring a public subnet.

---

## 🛣️ Route Table Configuration

Route Tables are configured to control traffic flow between subnets and external networks.

### 🔹 Public Route Table

1. Go to **VPC Dashboard → Route Tables**
2. Click **Create Route Table** and associate it with your VPC
3. Add route: `0.0.0.0/0 → Internet Gateway (IGW)`
4. Associate it with Both **Public Subnets**

📌 Enables direct internet access for Web Tier and Internet-facing Load Balancer.

<p align="center">
  <img src="./Images/8.PUBLICRT.png" width="800">
</p>

  ---

### 🔹 Private Route Table (Application Tier)

1. Create a new **Route Table**
2. Add route: `0.0.0.0/0 → NAT Gateway`
3. Associate it with Both **Private App Subnets**

📌 Allows outbound internet access (e.g., updates) while keeping instances private. 

<p align="center">
  <img src="./Images/9.PVTRT.png" width="800">
</p>

  ---

### 🔹 Private Route Table (Database Tier)

1. Create a separate **Route Table**
2. Do **not** add any internet route
3. Associate it with **Private DB Subnet**

📌 Ensures the database layer remains fully isolated and secure.

<p align="center">
  <img src="./Images/10.DBRT.png" width="800">
</p>

  ---

## 🔐 Security Configuration

Security is enforced using **Security Groups**, which act as virtual firewalls to regulate traffic between different layers of the architecture.
Each component is configured with controlled access rules to ensure secure and restricted communication:

<p align="center">
  <img src="./Images/11.SG.png" width="800">
</p>

- **Load Balancer Security Group:**  
  Allows **HTTP/HTTPS traffic (ports 80/443)** from the internet  

- **Web Tier Security Group:**  
  Accepts traffic only from the **Internet-facing Application Load Balancer**  

- **Internal Load Balancer Security Group:**  
  Accepts traffic only from the **Web Tier** and forwards requests to the **Application Tier (port 3000)**  

- **Application Tier Security Group:**  
  Accepts traffic only from the **Internal Load Balancer on port 3000**
 <br> (Port 3000 – Node.js application)

- **Database Security Group:**  
  Allows **MySQL traffic (port 3306)** only from the **Application Tier**  

> 🔒 This layered security approach ensures that each tier communicates only with the required components, minimizing exposure and enhancing overall system security.

---

# 📌 Part 2: Database Deployment

## 🔹 DB Subnet Group
To ensure proper isolation, a **DB Subnet Group** is created using private database subnets across multiple Availability Zones.

<p align="center">
  <img src="./Images/12.Subnet Group.png" width="800">
</p>

Go to the **RDS Dashboard → Subnet Groups → Create DB Subnet Group**, provide a name and description, select your VPC, and add the **database subnets from each Availability Zone**.

📌 This ensures the database is deployed in isolated private subnets.



## 🔹 Database Creation

<p align="center">
  <img src="./Images/13.DB create.png" width="800">
</p>

<p align="center">
  <img src="./Images/14.DB Setting.png" width="800">
</p>


Navigate to **RDS Dashboard → Databases → Create Database** and select **Full Configuration**.
- Engine: **MySQL DB Engine**
- Template: **Free Tier**
- Set **DB username and password** (Self managed)

## 🔹 Availability & Connectivity

<p align="center">
  <img src="./Images/15.DB-Connectivity.png" width="800">
</p>

- Deployment: **Single-AZ deployment** (Due To Free Tier limitations)
But in Real Scenarios Multi-AZ DB Cluster Deployments are used to ensure High Availability. 
- Select your **VPC and DB Subnet Group**  
- Set **Public Access → No**  

📌 This ensures high availability and keeps the database private.

## 🔹 Security Configuration

- Attach the **Database Security Group**
- Allow **MySQL (port 3306)** only from the Application Tier
- Use **password authentication**

## 🔹 Final Setup

<p align="center">
  <img src="./Images/16.MySQL-DB.png" width="800">
</p>

After creation:
- AWS provisions **Database instance** at your Selected Subnet 
- Note the **DB Instance Endpoints** for application connectivity  

📌 This endpoint will be used by the Application Tier to interact with the database.

⚠️ Note:
> A single-cluster setup is used as it is supported under the AWS Free Tier.
> Multi-node production setups require paid configurations.

---

# 📌 Part 3: Application Tier Deployment

## 🔐 Instance Access (App Tier)
The **App Tier instances** are deployed in private subnets and do not have direct internet access.
To securely access these instances, a **Jump Server (Bastion Host)** is used:

- The **Jump Server** is deployed in a **public subnet**
- SSH access is allowed only to the **Jump Server**
- From the Jump Server, access is established to **App Tier instances in private subnets**

<p align="center">
  <img src="./Images/17.SSH APP TIER.png" width="800">
</p>

📌 Traffic Flow: User → Jump Server (Public Subnet) → App Tier (Private Subnet)

📌 This approach ensures:
- No direct exposure of private instances to the internet  
- Controlled and secure administrative access

> 📌 Note: Alternatively, AWS Systems Manager Session Manager can be used to access instances without SSH or a bastion host.

## 🚀 App Tier Instance Setup
An EC2 instance is deployed in the **private app subnet** to host the Node.js application running on **port 3000**.

### 🔹 Instance Configuration
- AMI: **Amazon Linux 2023**
- Instance Type: **t3.micro (Free Tier)**
- Subnet: **Private App Subnet 1a**
- Security Group: **App Tier SG**

---

### 🔌 Connectivity Check
After connecting via SSH, verify internet access:
```bash
ping 8.8.8.8
```
📌 Confirms outbound connectivity via NAT Gateway.

### 🗄️ Database Configuration
Install MySQL client and connect to MySQL DB:

```bash
sudo yum install mariadb -y
mysql -h <RDS-ENDPOINT> -u <USERNAME> -p
```

### Create Database & Table:
<p align="center">
  <img src="./Images/18.MYSQL.png" width="800">
</p>

## ⚙️ Application Setup
Creating App Directory & adding Node js App
```bash
mkdir /myapp
cd /myapp
vi app.js
```

### Install Nodejs & NPM
```bash
sudo yum install nodejs npm -y
node -v
npm -v
```

## ⚙️ Environment Configuration & Dependencies
### 🔹 Create `.env` File
To securely manage configuration, create a `.env` file in the root directory of your application:

```bash
vi /myapp/.env
chmod 600 .env
```
Add the following environment variables:

```bash
DB_HOST=your-rds-endpoint
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=volunteerdb
PORT=3306
```
⚠️ Replace the values with your actual RDS database credentials and endpoint.


### Initialize Node project
```bash
npm init -y
npm install express mysql2 dotenv cors
```
This Creates package.json & Sets default project configuration


### Test run Application
```bash
node app.js
```

<p align="center">
  <img src="./Images/19.Node app.png" width="800">
</p>

### Install PM2
```bash
npm install -g pm2
pm2 start app.js
pm2 startup
pm2 save
```

<p align="center">
  <img src="./Images/20.PM2.png" width="800">
</p>

### Health check
```bash
curl http://localhost:3000/health
```
<p align="center">
  <img src="./Images/21.APP health.png" width="800">
</p>

## ✅ App-Server Setup Completed
The Application server has been successfully deployed and configured.

### ✔️ Key Achievements
- Node.js application running on **port 3000**
- Successfully connected to **MySQL database**
- Data retrieval verified via API endpoints  
- App process managed using **PM2**
- Private instance access secured via **Jump Server**
- Outbound internet access enabled via **NAT Gateway**

---
# 📌 Part 4: Web Tier Deployment
## 🌐 Web Tier Overview

The **Web Tier** is responsible for handling incoming client requests and serving static content. 
It also forwards API requests to the Application Tier.

This layer is deployed in **public subnets** and is exposed to the internet via an **Internet-facing Application Load Balancer**.

---

## 🚀 Web Server Setup

EC2 instances are launched in **public subnets** to host the web server.

### 🔹 Instance Configuration
- AMI: **Amazon Linux 2023**
- Instance Type: **t3.micro**
- Subnet: **Public Subnet**
- Security Group: **Web Tier SG (HTTP/HTTPS allowed)**

---

### ⚙️ Nginx Installation & Configuration
Install and start Nginx:
```bash
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

<p align="center">
  <img src="./Images/22.nginx Status.png" width="800">
</p>

### 🔁 Reverse Proxy Configuration:
Update Nginx config to forward API requests to App Tier via Internal Load Balancer

```bash
sudo vi /etc/nginx/nginx.conf
sudo systemctl restart nginx
```

<p align="center">
  <img src="./Images/23.nginx conf.png" width="800">
</p>

### Add Index.html
```bash
vi /usr/share/nginx/html/index.html
```

# 📌 Part 5: Post Deployment – AMI, Launch Template, Auto Scaling & Load Balancing

## 🚀 Overview

After successfully setting up the **Application Tier** and **Web Tier**, the architecture is enhanced to achieve **scalability, high availability, and fault tolerance**.

This is accomplished using:
- **Amazon Machine Images (AMI)**
- **Launch Templates**
- **Auto Scaling Groups (ASG)**
- **Application Load Balancers (ALB)**

---

## 🖼️ AMI Creation

Configured EC2 instances from both **Web Tier** and **App Tier** are used to create **AMIs**.

<p align="center">
  <img src="./Images/24.Create AMI.png" width="800">
</p>

These AMIs act as reusable templates containing:
- Operating system configuration  
- Installed software (Nginx / Node.js)  
- Application code  

📌 Enables rapid and consistent deployment of new instances.

---

## 📦 Launch Template

Launch Templates are created using the respective **AMIs** for Web and App tiers.

<p align="center">
  <img src="./Images/25.LaunchTEMP.png" width="800">
</p>

They define:
- Instance type (**t2.micro**)  
- Security Groups  
- AMI reference  

📌 Ensures all newly launched instances are **identical and pre-configured**.

---
## Created Target groups For Load Balancing & Auto-Scaling:

<p align="center">
  <img src="./Images/26.WEB-tg.png" width="800">
</p>
<br>
<p align="center">
  <img src="./Images/27.APPS-tg.png" width="800">
</p>

---

## 🔁 Load Balancing

### 🌍 Internet-Facing Load Balancer (Web Tier)

<p align="center">
  <img src="./Images/28.WebServer -LB.png" width="800">
</p>

- Handles incoming user requests  
- Routes traffic to Web Tier instances  
- Listener: **HTTP (80)**  

---

### 🔐 Internal Load Balancer (App Tier)


<p align="center">
  <img src="./Images/29.Internal-LB.png" width="800">
</p>

- Routes traffic from Web Tier  App Tier  
- Listener: **HTTP (80)**  
- Forwards requests to **port 3000 (Node.js app)**  

---

## 📈 Auto Scaling Groups (ASG)

Auto Scaling Groups are configured for both tiers:

<p align="center">
  <img src="./Images/30.ASG.png" width="800">
</p>

### 🔹 Web Tier ASG
The **Web Tier Auto Scaling Group (ASG)** is deployed across public subnets and is attached to an Internet-facing Application Load Balancer, maintaining a desired capacity of two instances to handle incoming user traffic and ensure high availability.

<p align="center">
  <img src="./Images/31.ASG launch TEMP.png" width="800">
</p>
<h4 align="center">Go to <b>EC2 → Auto Scaling Groups<b> → Click <b>Create Auto Scaling Group<b> → Select <b>Launch Template<b></h4>
<br>
<p align="center">
  <img src="./Images/32.ASG options.png" width="800">
</p>
<h4 align="center">Choose VPC & Subnets</h4>
<br>
<p align="center">
  <img src="./Images/33.ASG attach LB.png" width="800">
</p>
<h4 align="center">Attach Auto-scaling group to an Load Balancer</h4>
<br>
<p align="center">
  <img src="./Images/34.Scaling -ASG.png" width="800">
</p>
<h4 align="center">Select Dynamic Scaling Policy: When CPU Itilization Hits 70% → Autoscaling is invoked</h4>
<br>
<p align="center">
  <img src="./Images/35.SNS-ASG.png" width="800">
</p>
<h4 align="center">ASG Publishes SNS alerts to Subscribers whenever Ec2 fails to launch & Terminate  </h4>
<br>

### 🔹 App Tier ASG
The **Application Tier Auto Scaling Group (ASG)** is deployed across private app subnets and is connected to an internal Application Load Balancer, maintaining a desired capacity of two instances to support scalable backend processing while keeping the application layer secure and isolated.

📌 Benefits:
- Maintains desired number of instances  
- Replaces unhealthy instances automatically  
- Provides high availability across AZs  

---


## 🔄 End-to-End Architecture Flow

```text
User → Internet ALB → Web Tier (Nginx) → Internal ALB → App Tier (Node.js) → Database (MySQL)
```
# 🎥 Application DEMO Video: 
This video demonstrates the working deployment of the **AWS Three-Tier Web Application**, showcasing end-to-end connectivity between the frontend, backend, and database layers.

<p align="center">
  <a href="https://youtu.be/g-qtxnyHksw">
    <img src="./Images/36.DEMO-Thumbnail.png" width="700">
  </a>
</p>
<h4 align="center"> 📌 Click on the image above to watch the full demo on YouTube.</h4> 

### 🔍 What this demo shows:
This demo showcases the complete working of the deployed application, where the frontend is served through the Web Tier using Nginx, API requests are processed by the Application Tier running a Node.js backend, and data is retrieved from the Database Tier using Amazon RDS (MySQL). It demonstrates a fully functional end-to-end request flow across all layers of the three-tier architecture.



## 📜 **License**
This project is licensed under the **MIT License**.

---

## 👨‍💻 **Author**
**Shivam Ekale**  
-  *([💼 LinkedIn:](https://www.linkedin.com/in/shiivam22/))*  
-  *([🌐 Portfolio:](https://www.shivamekale.in))*  
---
