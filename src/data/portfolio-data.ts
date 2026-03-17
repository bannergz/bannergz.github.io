import type { PortfolioData } from "@/types";

export const portfolioData: PortfolioData = {
  name: "Banner Gonzales",
  title: "Technical Lead | Software Architect | Fintech Platforms",
  summary:
    "Systems Engineer with over 8 years of experience in the development and technical leadership of high-traffic financial platforms. Specialized in the design of microservices architectures, event-driven systems, and scalable cloud platforms. Currently a Technical Lead at Yape, leading engineering teams and the design of critical solutions used by millions of users within the BCP financial ecosystem. Strong focus on scalability, performance, and resilience in distributed systems.",
  contact: {
    email: "bannergz1999@gmail.com",
    phone: "+51 994 486 755",
    linkedin: "linkedin.com/in/bannergz",
  },
  skillCategories: [
    {
      title: "Software Architecture",
      icon: "🏗️",
      skills: [
        "Microservices Architecture",
        "Event-Driven Architecture",
        "Domain Driven Design (DDD)",
        "Hexagonal Architecture",
        "Clean Architecture",
        "C4 Model",
        "BIAN",
        "API Design (REST/GraphQL)",
      ],
    },
    {
      title: "Backend & Frameworks",
      icon: "⚙️",
      skills: [
        "Java (Spring Boot, Quarkus)",
        "NodeJS / NestJS",
        "Reactive Programming (RxJava)",
        "Functional Programming",
      ],
    },
    {
      title: "Cloud & Infrastructure",
      icon: "☁️",
      skills: ["AWS", "Azure", "Docker", "Microservices", "Observability"],
    },
    {
      title: "Observability",
      icon: "📊",
      skills: ["Datadog", "Dynatrace", "Kibana", "PagerDuty", "Grafana"],
    },
    {
      title: "Databases",
      icon: "🗄️",
      skills: [
        "PostgreSQL",
        "Oracle",
        "MongoDB",
        "SQL Server",
        "DB2",
        "CosmosDB",
      ],
    },
    {
      title: "Engineering Practices",
      icon: "🔧",
      skills: [
        "TDD / BDD",
        "CI/CD",
        "Agile (Scrum, Kanban)",
        "Design Thinking",
      ],
    },
  ],
  experience: [
    {
      period: "Nov 2022 – Present",
      role: "Software Technical Lead",
      company: "Yape",
      highlights: [
        "Technical leadership of an engineering team responsible for multiple capabilities of the Yape ecosystem used by millions of users.",
        "Design of solution architectures using the C4 Model and principles of DDD and microservices architecture.",
        "Responsible for more than 19 APIs in a microservices architecture integrated with BCP's financial systems.",
        "Design of event-driven solutions for processing financial transactions.",
        "Implementation of backend services with Spring Boot, Quarkus, and NodeJS.",
        "Definition of architectural guidelines for cross-organizational teams.",
        "Monitoring and observability of critical systems using Dynatrace, Datadog, Grafana, Kibana, and PagerDuty.",
        "Resolution of critical production incidents in high-availability and high-concurrency systems.",
      ],
    },
    {
      period: "Jan 2021 – Nov 2022",
      role: "Software Technical Lead",
      company: "Globant Perú",
      highlights: [
        "Technical leadership of the team responsible for core capabilities of the Yape ecosystem.",
        "Design and development of financial microservices for critical functionalities: Refunds, Profile Management, Blacklisting, Unenrollment, Enterprise Auth.",
        "Product monitoring using Dynatrace and Kibana tools.",
        "Design of REST APIs for high-volume transaction services.",
        "Development of more than 15 business APIs using microservices architecture.",
        "Implementation of clean and decoupled architectural patterns.",
        "Integration with the bank's core financial system.",
      ],
    },
    {
      period: "Feb 2020 – Jan 2021",
      role: "Software Application Java Developer",
      company: "Everis Perú",
      highlights: [
        "Technical team leader at BCP, achieving quarterly project goals with functionalities such as credit card payments, challenge authentication, and enrollment flows.",
        "Development, testing, and delivery of reactive applications.",
        "Product analysis and definition based on microservices architecture.",
        "Responsible for more than 10 APIs with microservices architecture.",
        "Roadmap planning and monitoring.",
      ],
    },
    {
      period: "Apr 2019 – Feb 2020",
      role: "Software University Practices",
      company: "IBM Perú",
      highlights: [
        "Development of enterprise solutions for corporate systems.",
        "Development of backend services in Java.",
        "Integration with enterprise systems and corporate databases.",
        "Development of REST APIs for internal applications.",
        "Participation in technology modernization projects.",
        "Development of custom bots using Automation Anywhere RPA tool.",
      ],
    },
  ],
  achievements: [
    {
      metric: "Millions",
      description:
        "Users impacted by technological solutions designed and implemented on Yape.",
    },
    {
      metric: "20+",
      description:
        "Enterprise APIs developed using microservices architecture.",
    },
    {
      metric: "5x",
      description: "Optimization of applications and products.",
    },
    {
      metric: "250%",
      description:
        "Efficiency improvement in the customer service process.",
    },
    {
      metric: "19+",
      description:
        "APIs managed in production integrated with BCP's financial systems.",
    },
  ],
  education: [
    {
      period: "May 2016 – Dec 2019",
      degree: "Bachelor in Systems Engineering",
      institution: "Universidad Tecnológica del Perú",
    },
  ],
  languages: [
    { language: "Spanish", level: "Native" },
    { language: "English", level: "Professional" },
  ],
  specializations: [
    "Microservices Architecture",
    "Domain Driven Design",
    "Cloud Architecture",
    "Agile & Scrum",
  ],
};
