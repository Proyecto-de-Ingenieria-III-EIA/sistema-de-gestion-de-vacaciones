import { Button } from '@/components/ui/button';
import { ButtonHTMLAttributes } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

const IconButton = ({ children, size = 'md', ...props }: IconButtonProps) => {
  return (
    <Button variant='ghost' className='h-auto p-2 hover:bg-muted' {...props}>
      {children}
    </Button>
  );
};

export { IconButton };
