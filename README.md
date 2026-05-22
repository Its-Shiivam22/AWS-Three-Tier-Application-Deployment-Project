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
![Architecture Diagram](./architecture.png)

---

## 🧰 **Tech Stack**
- **Cloud:** AWS  
- **Compute:** EC2  
- **Networking:** VPC, Subnets, Route Tables, IGW, NAT Gateway  
- **Load Balancer:** Application Load Balancer (ALB)  
- **Database:** MySQL (RDS)  
- **Web Server:** Nginx  
- **Backend:** Node.js  
- **Security:** Security Groups, NACLs  

---

## 🌐 **Architecture Details**

### 🔹 **VPC Setup**
- VPC Name: **Mumbai-VPC**
- CIDR: **192.168.0.0/16**

### 🔹 **Subnets**
- 2 Public Subnets (Web Tier)
- 2 Private Subnets (App Tier)
- 1 Database Subnet

### 🔹 **Availability Zones**
- ap-south-1a  
- ap-south-1b
- ap-south-1c

---

## 🔐 **Networking**
- Internet Gateway attached to VPC  
- NAT Gateway for private subnet internet access  
- Route Tables configured for public and private routing  

---

## 🖥️ **EC2 Configuration**

### **Web Tier**
- Hosted in Public Subnets  
- Nginx installed  
- Reverse proxy configured  

### **App Tier**
- Hosted in Private Subnets  
- Node.js application deployed  

---

## 🗄️ **Database**
- Amazon RDS (MySQL)  
- Private subnet deployment  
- No public access  

---

## ⚖️ **Load Balancer**
- Application Load Balancer (ALB)  
- Target group attached to Web Tier  
- Health checks configured  

---

## 🔒 **Security Groups**

| Layer | Access |
|------|--------|
| ALB | HTTP/HTTPS from Internet |
| Web | From ALB |
| App | From Web Tier |
| DB | MySQL (3306) from App Tier |

---

## 🚀 **Deployment Steps**
1. Create VPC and subnets  
2. Configure Internet Gateway & NAT Gateway  
3. Launch EC2 instances (Web & App)  
4. Set up RDS database  
5. Configure ALB and target groups  
6. Deploy application code  
7. Test end-to-end connectivity  

---

## 🧪 **Testing**
- Accessed application via ALB DNS  
- Verified database connectivity  
- Tested load balancing  

---

## 📊 **Key Features**
- ✅ High Availability (Multi-AZ)  
- ✅ Secure (Private Subnets for App & DB)  
- ✅ Scalable Architecture  
- ✅ Fault Isolation  

---

## ⚠️ **Challenges Faced**
- Security group misconfigurations  
- Database connection issues  
- Routing between subnets  

---

## 📜 **License**
This project is licensed under the **MIT License**.

---

## 👨‍💻 **Author**
**Shivam**  
- 💼 LinkedIn: *(add your link)*  
- 🌐 Portfolio: *(add your link)*  

---
