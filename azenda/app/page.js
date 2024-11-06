// app/page.js
'use client'
import TaskCalendar from '../components/Calendar';

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Azenda</h1>
      <TaskCalendar />
    </main>
  );
}
