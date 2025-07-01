# Exam Assistant

A modern web application for rapid exam preparation, powered by AI. Exam Assistant enables students to upload PDF study materials and receive concise, exam-focused explanations, mnemonics, and must-know formulas—instantly and beautifully presented.

## Features
- **PDF Upload & Parsing:** Upload your study notes in PDF format (up to 15MB) and view them in a full-featured, modern document viewer.
- **AI-Powered Simplification:** Instantly generate simplified explanations, mnemonics, and key formulas for any page using the Gemini API.
- **Intuitive Navigation:** Effortlessly navigate, zoom, and fit-to-width/page with sticky, visually grouped controls.
- **Clean, Responsive UI:** Built with React and Tailwind CSS for a seamless experience on any device.
- **No Authentication Required:** Start using the app immediately—no sign-up or login needed.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Document Parsing:** pdf-lib.js, pdfjs-dist
- **AI Engine:** Gemini API (Google)
- **UI Components:** react-dropzone, react-pdf
- **Hosting:** Vercel (recommended)



## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Gemini API key (obtain from Google)

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/YOUR_USERNAME/exam-assistant.git
   cd exam-assistant
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```

### Running Locally
```sh
npm run dev
# or
yarn dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.


## License
This project is licensed under the MIT License.

---
