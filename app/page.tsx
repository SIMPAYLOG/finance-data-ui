import {Footer} from "@/components/layout/footer"
import {Header} from "@/components/layout/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Header />
    <main>
      <h1>SIMPAYLOG 프로젝트입니다!</h1>
    </main>
    <Footer />
    </div>
  );
}