export function AbsenceLegend() {
  return (
    <div className='flex flex-wrap gap-4'>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 rounded-full bg-green-200 dark:bg-green-900'></div>
        <span>Vacaciones</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 rounded-full bg-red-200 dark:bg-red-900'></div>
        <span>Espontánea</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 rounded-full bg-yellow-200 dark:bg-yellow-900'></div>
        <span>Informal</span>
      </div>
    </div>
  );
}
