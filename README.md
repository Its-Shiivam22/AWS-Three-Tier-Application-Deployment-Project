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
  <img src="./Images/architecture.png" width="800">
</p>

In this architecture, a Internet-facing Application Load Balancer forwards client traffic to our web tier EC2 instances. The web tier is running Nginx webservers that are configured to serve a index.html website and redirects our API calls to the application tier’s internal facing load balancer. The internal facing load balancer then forwards that traffic to the application tier, which is written in Node.js. The application tier manipulates data in an MySQL SIngle Cluster -Free tier database and returns it to our web tier. Load balancing, health checks and autoscaling groups are created at each layer to maintain the availability of this architecture.

---

# 📌 Part 1: Network and Security

## 🌐 Network Architecture

The network architecture is designed within a custom **Virtual Private Cloud (VPC)** to ensure isolation, scalability, and secure communication between different layers of the application.

The VPC is configured with a CIDR block of **192.168.0.0/16** and deployed in the **ap-south-1 (Mumbai) region**, providing a sufficient IP address range for all resources within the architecture.

To organize resources efficiently, the VPC is divided into **six subnets** across multiple Availability Zones. This design ensures proper isolation between tiers and enhances overall security.

<h3 align="center">VPC Resource Map</h3>
<p align="center">
  <img src="./Images/VPC-ResourceMap.png" width="800">
</p


- **Public Subnets (2):** Used for the Web Tier instances and Internet-facing Application Load Balancer  
- **Private App Subnets (2):** Used for Application Tier instances and the Internal Load Balancer  
- **Private DB Subnets (2):** Used for the Database layer  

The infrastructure spans across two Availability Zones:

- **ap-south-1a**  
- **ap-south-1b**  

This multi-AZ deployment ensures **high availability, fault tolerance, and resilience** against failures.

---

## 🌍 Internet Connectivity

Internet connectivity is established using AWS-managed networking components to allow controlled access between the application and external users.

An **Internet Gateway (IGW)** is attached to the VPC, enabling resources in public subnets to communicate with the internet. This allows users to access the application via the **internet-facing load balancer**.

For resources in private subnets, direct internet access is restricted to enhance security. Instead, a **NAT Gateway** is deployed in the public subnet. This allows private instances to initiate outbound internet connections (e.g., for updates or package installations) while blocking inbound traffic from external sources.

---

## 🛣️ Route Table Configuration

Route Tables are configured to control traffic flow between subnets and external networks.

- **Public Route Table:**  
  Associated with public subnets and configured with a route (`0.0.0.0/0`) pointing to the **Internet Gateway (IGW)**, enabling direct internet access  

- **Private Route Table (App Tier):**  
  Associated with private app subnets and configured with a route (`0.0.0.0/0`) pointing to the **NAT Gateway**, allowing secure outbound internet access  

- **Private Route Table (DB Tier):**  
  Associated with database subnets with no direct internet route, ensuring the database remains **fully isolated and secure**

  ---

## 🔐 Security Configuration

Security is implemented using **Security Groups**, which act as virtual firewalls to control traffic flow between different layers of the architecture.

Each component is configured with strict access rules to ensure secure communication:

- **Load Balancer Security Group:**  
  Allows **HTTP/HTTPS** traffic from the internet  

- **Web Tier Security Group:**  
  Accepts traffic only from the **Internet-facing Application Load Balancer**  

- **Internal Load Balancer Security Group:**  
  Accepts traffic only from **Web Tier instances** and forwards requests to the **Application Tier**  

- **Application Tier Security Group:**  
  Allows traffic only from the **Internal Load Balancer**  

- **Database Security Group:**  
  Allows **MySQL traffic (port 3306)** only from the **Application Tier**  

---




## 📜 **License**
This project is licensed under the **MIT License**.

---

## 👨‍💻 **Author**
**Shivam**  
- 💼 LinkedIn: *(add your link)*  
- 🌐 Portfolio: *(add your link)*  

---
