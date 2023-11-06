import ImageEditor from "@/app/components/ImageEditor";

export default function Home() {
  return (
    <>
      <header className="pt-12 text-center pb-7">
        <h1 className="text-3xl font-bold text-slate-50">Image Editor</h1>
      </header>
      <main className='max-w-5xl mx-auto'>
        <ImageEditor />
      </main>
    </>
  );
}