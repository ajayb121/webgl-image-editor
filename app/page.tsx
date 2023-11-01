import ImageEditor from "@/app/components/ImageEditor";

export default function Home() {
  return (
    <>
      <header className="pt-12 text-center pb-5">
        <h1 className="text-3xl font-bold">Image Editor</h1>
      </header>
      <main className='max-w-xl mx-auto'>
        <ImageEditor />
      </main>
    </>
  );
}