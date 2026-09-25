🚀 Enhanced Research Paper Management System

An AI-powered full-stack research paper management platform with
role-based workflows, secure authentication, automated paper
processing, AI summarization, and Retrieval-Augmented Generation (RAG)
based Paper Chat.

The Enhanced Research Paper Management System is a full-stack web
application designed to digitize and streamline the research paper
lifecycle within academic institutions.

The platform provides dedicated workflows for Admins, Teachers, and
Students, covering paper submission, teacher assignment, academic
review, comments, status tracking, document storage, AI-powered
summarization, and contextual question answering over research papers.

The latest version extends the platform with a Basic RAG pipeline,
allowing users to ask questions about a research paper and receive
answers grounded in the paper's extracted content.

📌 Table of Contents

✨ Key Highlights

👥 User Roles

🚀 Features

Authentication & Security

Admin Features

Teacher Features

Student Features

AI Features

🧠 RAG-Powered Paper Chat

🔄 RAG Processing Pipeline

💬 Paper Chat Flow

🛠️ Technology Stack

🏗️ System Architecture

🔐 Authentication Flow

🔑 Forgot Password Flow

📄 Research Paper Submission
Flow

🤖 AI Summary Flow

📝 Review Workflow

📁 Project Structure

🗄️ Data & Storage Architecture

📊 Database Collections

⚙️ Environment Variables

🚀 Installation & Setup

🧪 RAG Development Notes

🗺️ Future Roadmap

👨‍💻 Author

✨ Key Highlights

🔐 Secure JWT-based authentication and role-based authorization

📧 OTP-based email verification and password recovery

👨‍💼 Dedicated Admin, Teacher, and Student workflows

📄 Research paper upload and management

☁️ Cloudinary-based PDF storage

📝 Teacher assignment and paper review workflow

🤖 Google Gemini-powered paper summarization

🧠 Retrieval-Augmented Generation (RAG) for paper question answering

🔎 Semantic vector search using Qdrant

🧩 PDF text chunking with overlapping chunks

🧮 Gemini-powered text embeddings

⚡ BullMQ + Redis background processing for paper indexing

💬 Paper Chat for asking questions about uploaded research papers

🔁 Retry handling for transient AI API failures

🏗️ Modular MVC-based backend architecture

📱 Responsive frontend using HTML, CSS, and JavaScript

👥 User Roles

The system is organized around three primary roles:

Role                                Responsibilities

👨‍💼 Admin                        Manage teachers, students,
assignments, and system activity

👨‍🏫 Teacher                      Review assigned papers, add
comments, update status, generate
summaries, and interact with paper
content

🚀 Features

🔐 Authentication & Security

The application provides a complete authentication and
account-management workflow.

Features

User Registration

OTP Email Verification

Login & Logout

Forgot Password

Reset Password

JWT Authentication

Role-Based Authorization

Rate Limiting

Redis-based OTP Storage

Protected API Routes

Environment-based secret management

Supported Authentication Roles

Admin
Teacher
Student

👨‍💼 Admin Features

Administrators manage the academic research workflow from a centralized
interface.

Features

Create Teacher Accounts

Manage Teachers

Manage Students

Assign Research Papers to Teachers

Monitor Paper Reviews

Track System Activity

Manage academic workflow

Teacher Account Creation Flow

Admin
  │
  ├── Create Teacher Account
  │
  ▼
Teacher Account Created
  │
  ▼
Email Sent
  │
  ▼
Teacher Receives Credentials
  │
  ▼
Teacher Login

👨‍🏫 Teacher Features

Teachers are responsible for reviewing and evaluating assigned research
papers.

Features

View Assigned Papers

Review Research Papers

Add Comments

Update Paper Status

Generate AI Summary

Track Reviewed Papers

Ask questions about paper content using Paper Chat

Paper Status

Pending
   ↓
Under Review
   ↓
Accepted / Rejected

👨‍🎓 Student Features

Students can submit and track their research work through the platform.

Features

Register & Verify Account

Submit Research Papers

View Submitted Papers

Track Review Status

View Teacher Comments

Access AI-powered paper features

🤖 AI Features

The system uses Google Gemini to provide AI-powered research
assistance.

1. AI Summary Generation

Teachers can generate concise AI summaries from extracted research paper
text.

The generated summary can include:

Short Summary

Key Points

Keywords

Summary Flow

Research Paper
      │
      ▼
PDF Text Extraction
      │
      ▼
Extracted Text
      │
      ▼
Google Gemini
      │
      ▼
AI Summary

🧠 RAG-Powered Paper Chat

The latest version introduces Retrieval-Augmented Generation (RAG)
to the Research Paper Management System.

Instead of sending an entire research paper directly to the LLM for
every question, the system:

Processes the paper

Splits extracted text into chunks

Generates embeddings for the chunks

Stores the embeddings in Qdrant

Converts the user's question into an embedding

Performs semantic similarity search

Retrieves the most relevant chunks

Sends the retrieved context to Gemini

Generates a context-grounded answer

This allows the system to provide answers based on the relevant content
of the research paper.

🧩 RAG Components

Component                           Responsibility

PDF Extraction                  Extract text from uploaded research
papers

Chunking Service                Divide extracted text into
manageable overlapping chunks

Gemini Embeddings               Convert chunks and user questions
into vectors

Qdrant                          Store and retrieve document vectors

BullMQ                          Manage asynchronous
paper-processing jobs

Redis                           Queue and OTP infrastructure

RAG Service                     Orchestrate retrieval and answer
generation

🔄 RAG Processing Pipeline

Paper indexing is performed asynchronously using BullMQ + Redis.

flowchart TD
    A[Student Uploads PDF] --> B[Multer]
    B --> C[PDF Text Extraction]
    C --> D[MongoDB]
    C --> E[Cloudinary]
    C --> F[BullMQ Queue]

    F --> G[Redis]
    G --> H[RAG Worker]

    H --> I[Read Paper from MongoDB]
    I --> J[Text Chunking]
    J --> K[Gemini Embeddings]
    K --> L[Qdrant Vector Database]

    L --> M[Paper Ready for AI Chat]

Why Background Processing?

Embedding generation and vector indexing can take time, especially for
large research papers.

Instead of making the student's upload request wait for the complete RAG
indexing process, the system separates the work:

Upload Request
      │
      ▼
Store Paper
      │
      ▼
Create Background Job
      │
      ▼
Return Response
      │
      └──────────────► Worker processes paper asynchronously

This keeps the main API workflow separate from computationally heavier
AI processing.

💬 Paper Chat Flow

Once a paper has been indexed, users can ask questions about it.

flowchart TD
    A[User Question] --> B[Generate Question Embedding]
    B --> C[Qdrant Semantic Search]
    C --> D[Retrieve Top-K Chunks]
    D --> E[Build Context]
    E --> F[Gemini]
    F --> G[Context-Grounded Answer]
    G --> H[Display Answer]

Example

User:
"What is CRDT?"

        ↓

Question Embedding

        ↓

Qdrant Similarity Search

        ↓

Relevant Paper Chunks

        ↓

Gemini + Retrieved Context

        ↓

Answer:
"CRDT stands for Conflict-free Replicated Data Types..."

The current RAG implementation is designed to answer using the retrieved
paper context rather than relying on unrelated external knowledge.

🛠️ Technology Stack

Frontend

HTML5

CSS3

JavaScript (ES6+)

Responsive UI

Backend

Node.js

Express.js

REST APIs

MVC Architecture

JWT Authentication

Middleware-based Authorization

Database

MongoDB

MongoDB Atlas

Caching & Queue Infrastructure

Redis

BullMQ

Vector Database

Qdrant

AI

Google Gemini API

Gemini Embeddings

Retrieval-Augmented Generation (RAG)

AI Document Summarization

File Storage

Cloudinary

Email

Resend

Development Tools

Git

GitHub

VS Code

Postman

🏗️ System Architecture

The application follows a modular full-stack architecture.

flowchart TB
    U[Users]

    U --> FE[Frontend<br/>HTML + CSS + JavaScript]

    FE --> API[Node.js + Express API]

    API --> AUTH[Authentication & Authorization]
    API --> DB[(MongoDB)]
    API --> CLOUD[Cloudinary]
    API --> REDIS[(Redis)]
    API --> GEMINI[Google Gemini]

    API --> QUEUE[BullMQ Queue]

    QUEUE --> WORKER[RAG Worker]

    WORKER --> DB
    WORKER --> CHUNK[Chunking Service]
    WORKER --> EMB[Gemini Embeddings]
    WORKER --> QDRANT[(Qdrant)]

    CHAT[Paper Chat] --> API
    API --> RAG[RAG Service]
    RAG --> QDRANT
    RAG --> GEMINI

🔐 Authentication Flow

flowchart TD
    A[User Registration] --> B[Create Account]
    B --> C[Generate OTP]
    C --> D[Store OTP in Redis]
    D --> E[Send OTP via Resend]
    E --> F[User Verifies OTP]
    F --> G[Account Verified]
    G --> H[Login]
    H --> I[JWT Authentication]
    I --> J[Protected Routes]

🔑 Forgot Password Flow

flowchart TD
    A[Forgot Password] --> B[Enter Email]
    B --> C[Generate OTP]
    C --> D[Store OTP in Redis]
    D --> E[Send OTP]
    E --> F[Verify OTP]
    F --> G[Reset Password]
    G --> H[Password Updated]

📄 Research Paper Submission Flow

flowchart TD
    A[Student] --> B[Submit Paper]
    B --> C[Multer]
    C --> D[PDF Validation]
    D --> E[Extract Text]

    E --> F[MongoDB]
    E --> G[Cloudinary]
    E --> H[BullMQ]

    H --> I[Redis]
    I --> J[RAG Worker]
    J --> K[Chunk Text]
    K --> L[Generate Embeddings]
    L --> M[Store Vectors in Qdrant]

🤖 AI Summary Flow

flowchart TD
    A[Research Paper] --> B[Extracted Text]
    B --> C[AI Summary Request]
    C --> D[Google Gemini]
    D --> E[Summary]
    E --> F[Store Summary]
    F --> G[Display to Teacher]

📝 Review Workflow

flowchart TD
    A[Student Submits Paper]
    A --> B[Admin Assigns Teacher]
    B --> C[Teacher Views Assigned Paper]
    C --> D[Teacher Reviews Paper]
    D --> E[Add Comments]
    E --> F[Update Status]

    F --> G{Decision}
    G -->|Accepted| H[Accepted]
    G -->|Rejected| I[Rejected]
    G -->|Needs Review| J[Under Review]

📁 Project Structure

Enhanced_Research_Paper_System
│
├── Frontend
│   ├── admin
│   ├── add-teacher
│   ├── all-teachers
│   ├── all-students
│   ├── login
│   ├── register
│   ├── forgot-password
│   ├── reset-password
│   ├── verify-email
│   ├── verify-otp
│   ├── submit-paper
│   ├── review-papers
│   ├── reviewed-papers
│   ├── student-dashboard
│   ├── teacher-dashboard
│   ├── view-paper
│   └── shared
│
└── Backend
    ├── controllers
    ├── db
    ├── middlewares
    ├── models
    ├── redis
    │   ├── paper.queue.js
    │   └── paper.worker.js
    ├── routes
    ├── services
    │   ├── ai.service.js
    │   ├── chunking.service.js
    │   ├── embeding.service.js
    │   ├── qdrant.service.js
    │   └── rag.service.js
    ├── utils
    ├── validations
    ├── app.js
    └── index.js

🗄️ Data & Storage Architecture

The system uses different storage technologies for different
responsibilities.

                         Research Paper
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
          MongoDB         Cloudinary         Qdrant
              │               │                │
              │               │                └─ Vector embeddings
              │               └────────────────── Original PDF
              └────────────────────────────────── Metadata + extracted text

MongoDB

Stores application-level research paper data such as:

Paper Metadata

PDF URL

Extracted Text

AI Summary

Teacher Comments

Review Status

User / Role Relationships

Cloudinary

Stores the original uploaded PDF files.

Qdrant

Stores vector representations of paper chunks for semantic retrieval.

A Qdrant payload currently contains information such as:

{
    text,
    paperId,
    chunkIndex
}

This allows retrieved vector points to be associated with their source
paper and chunk.

Redis

Used for:

OTP storage

BullMQ queue infrastructure

Background processing coordination

📊 Database Collections

Users

Stores:

Student Accounts

Teacher Accounts

Admin Accounts

Authentication-related information

Papers

Stores:

Paper Metadata

PDF URL

Extracted Text

AI Summary

Teacher Comments

Review Status

Paper ownership / assignment information

🧠 RAG Implementation Details

Chunking

The current implementation uses overlapping chunks to reduce the chance
of losing context between chunk boundaries.

Chunk 1
████████████████████████

              Chunk 2
              ████████████████████████

                            Chunk 3
                            ████████████████████████

Current configuration:

Chunk Size    = 1000 characters
Chunk Overlap = 200 characters

Embeddings

The system uses:

Gemini Embedding Model
        ↓
Text
        ↓
Vector
        ↓
3072 dimensions

Both document chunks and user questions are converted into embeddings
before semantic search.

Vector Search

Qdrant performs similarity search against the stored paper vectors.

The current Paper Chat pipeline retrieves the top relevant chunks and
provides them to Gemini as context.

🔒 RAG Answer Grounding

The RAG answer-generation layer is instructed to:

Use the retrieved paper context

Avoid unsupported information

Avoid inventing facts

Return a clear answer

Indicate when the retrieved context does not contain the answer

This creates a basic grounded question-answering workflow over
research papers.

⚙️ Environment Variables

Create a .env file in the backend:

PORT=

MONGODB_URI=
DB_NAME=

JWT_SECRET=
JWT_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

REDIS_URL=

RESEND_API_KEY=

GEMINI_API_KEY=

QDRANT_URL=
QDRANT_API_KEY=

⚠️ Never commit your .env file, API keys, JWT secrets, database
credentials, or cloud credentials to GitHub.

🚀 Installation & Setup

1. Clone the Repository

git clone https://github.com/MalikHassan49/Enhanced_Research_Paper_System.git

2. Move into the Project

cd Enhanced_Research_Paper_System

3. Install Backend Dependencies

cd New_Backend
npm install

4. Configure Environment Variables

Create:

.env

and add the required credentials.

5. Start the Backend

npm run dev

6. Start the Frontend

Open the frontend using your preferred local development server, such as
VS Code Live Server.

🧪 RAG Development Notes

The RAG system consists of two major workflows.

Paper Indexing

PDF
 ↓
Text Extraction
 ↓
Chunking
 ↓
Embeddings
 ↓
Qdrant

This process is handled asynchronously through:

BullMQ → Redis → RAG Worker

Question Answering

User Question
 ↓
Question Embedding
 ↓
Qdrant Search
 ↓
Top-K Chunks
 ↓
Context
 ↓
Gemini
 ↓
Answer

This separation keeps document indexing and question answering
as two distinct responsibilities.

📈 Current RAG Capabilities

The current implementation supports:

✅ PDF text extraction

✅ Text chunking

✅ Overlapping chunks

✅ Gemini embeddings

✅ Qdrant vector storage

✅ Semantic similarity search

✅ Paper-specific RAG endpoint

✅ Context-based answer generation

✅ Basic answer grounding

✅ Background indexing with BullMQ + Redis

✅ Retry handling for transient AI API failures

✅ Paper Chat frontend integration

🗺️ Future Roadmap

The project can be extended into a more advanced research intelligence
platform.

🔐 Secure Document-Aware RAG

Paper-level access filtering

Student / Teacher authorization-aware retrieval

Metadata filtering

Document ownership validation

📚 Multi-Paper RAG

Search across multiple research papers

Cross-paper question answering

Research paper comparison

Multi-document context retrieval

🔎 Advanced Retrieval

Hybrid keyword + vector search

Metadata-aware search

Query rewriting

Reranking

Better chunking strategies

Structure-aware retrieval

📑 Research Intelligence

Source citations

Page-level references

Research gap detection

Related paper discovery

Literature comparison

Research trend analysis

📊 RAG Evaluation

Retrieval evaluation

Answer relevance

Faithfulness / groundedness evaluation

Retrieval precision and recall

RAG quality monitoring

🏗️ Infrastructure & Production

Dockerized deployment

Cloud deployment improvements

Dedicated worker infrastructure

Production observability

AI provider/model fallback

Rate-limit aware AI request management

🔭 Long-Term Vision

The long-term goal is to evolve this system from a traditional paper
management application into an AI-powered Research Paper Intelligence
Platform.

                    Research Paper Platform
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
     Management            Retrieval            AI
          │                   │                   │
          ▼                   ▼                   ▼
   Submit / Review      Semantic Search      Paper Chat
   Assign / Track       Hybrid Search        Summaries
   Comments             Reranking            Citations
                        Multi-Paper           Research Gaps

The platform can eventually support researchers and academic
institutions with not only paper management, but also research
discovery, document intelligence, and AI-assisted academic analysis.

👨‍💻 Author

Hassan Raza

BS Software Engineering
Full-Stack MERN Developer | AI Enthusiast | Research Paper
Management System Developer

Connect

GitHub: MalikHassan49

LinkedIn: Hassan
Raza

⭐ Project Repository

GitHub Repository

https://github.com/MalikHassan49/Enhanced_Research_Paper_System

If you find this project useful, consider giving the repository a ⭐.