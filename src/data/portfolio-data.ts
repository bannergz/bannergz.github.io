import type { PortfolioData } from "@/types";

export const portfolioData: PortfolioData = {
  name: "Banner Gonzales",
  title: "Software Architect | AI & Agentic Systems | Fintech at Scale",
  tagline:
    "I architect fintech platforms for millions of users — and build the developer platforms and AI workflows engineering teams run on.",
  summary:
    "Systems Engineer with over 8 years architecting high-traffic financial platforms, now building the developer platforms and AI workflows that engineering teams run on. Principal Engineer at YaVendio, working across a polyglot fleet of Rust, TypeScript, and Python services. Previously Technical Lead at Yape, where I led the design of microservices and event-driven systems serving millions of users within the BCP financial ecosystem. I work where distributed-systems rigor meets agentic AI: spec-driven development, multi-agent workflows, and platforms that make teams measurably faster.",
  contact: {
    email: "bannergz1999@gmail.com",
    phone: "+51 994 486 755",
    linkedin: "linkedin.com/in/bannergz",
  },
  heroStats: [
    { value: "8+", label: "Years Experience" },
    { value: "20+", label: "Enterprise APIs" },
    { value: "Millions", label: "Users Impacted" },
    { value: "300%", label: "AI Efficiency Gain" },
  ],
  skillCategories: [
    {
      title: "AI & Agentic Systems",
      icon: "🤖",
      skills: [
        "Agentic Workflows",
        "Multi-Agent Orchestration",
        "Claude / LLM Integration",
        "LangChain",
        "LangGraph",
        "RAG",
        "Spec-Driven Development",
        "MCP (Model Context Protocol)",
        "AI Code Review",
      ],
    },
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
        "Rust",
        "Java (Spring Boot, Quarkus)",
        "NodeJS / NestJS",
        "Python",
        "Reactive Programming (RxJava, WebFlux)",
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
      title: "Data & Persistence",
      icon: "🗄️",
      skills: [
        "PostgreSQL",
        "Oracle",
        "MongoDB",
        "SQL Server",
        "DB2",
        "CosmosDB",
        "Redis",
        "Caffeine",
        "Prisma",
        "Hibernate",
        "Flyway",
      ],
    },
    {
      title: "Testing & Quality",
      icon: "🧪",
      skills: [
        "JUnit5",
        "Mockito",
        "Jest",
        "Testcontainers",
        "SonarQube",
        "Checkstyle",
        "Fortify",
        "Continuous Benchmarking",
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
      period: "Jun 2026 – Present",
      role: "Principal Engineer",
      company: "YaVendio",
      highlights: [
        "Technical leadership of an engineering team responsible for multiple platform capabilities.",
        "Built a self-updating developer portal aggregating documentation and OpenAPI specifications across 60+ internal services, with automated documentation-health scoring and SSO-gated access.",
        "Designed an authenticated architecture-documentation platform with C4 modeling, validated in CI on every change.",
        "Authored the organization's Rust microservice scaffold — hexagonal architecture, persistence, observability bootstrap, and container-based integration testing — adopted as the fleet standard.",
        "Introduced continuous performance benchmarking across three production services and codified it as an organization-wide engineering standard.",
        "Contributor to and power user of the internal agentic AI harness — skills, subagents, and safety hooks for Claude-based workflows — used across the engineering organization.",
        "Daily delivery across a polyglot fleet of Rust, TypeScript, and Python services, spanning backend, frontend, and infrastructure.",
      ],
    },
    {
      period: "Nov 2022 – Mar 2026",
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
        "Design and development of financial microservices for critical customer experience (CX) functionalities.",
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
      company: "NTT DATA",
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
      company: "IBM",
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
      metric: "5x",
      description: "Optimization of applications and products.",
    },
    {
      metric: "250%",
      description: "Efficiency improvement in the customer service process.",
    },
    {
      metric: "19+",
      description:
        "APIs managed in production integrated with BCP's financial systems.",
    },
    {
      metric: "60+",
      description:
        "Internal services aggregated into a self-updating developer documentation portal with automated health scoring.",
    },
    {
      metric: "Org-wide",
      description:
        "Continuous performance benchmarking introduced across production services and codified as an engineering standard.",
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
    { language: "English", level: "Proficient" },
  ],
  specializations: [
    "Agentic AI Systems",
    "Microservices Architecture",
    "Domain Driven Design",
    "Technical Leadership",
  ],
};
