/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#feb600]/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
    {
        variants: {
            variant: {
                default:
                    'bg-[#feb600] text-[#0f172a] hover:bg-[#e0a100] active:scale-[0.99] font-semibold shadow-md shadow-[#feb600]/10',
                destructive:
                    'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
                outline:
                    'border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600 hover:text-[#feb600]',
                secondary:
                    'bg-slate-800 text-slate-200 border border-slate-700/60 hover:bg-slate-700 hover:border-slate-600',
                ghost:
                    'text-slate-300 hover:bg-slate-800/80 hover:text-white',
                link:
                    'text-[#feb600] underline-offset-4 hover:underline',
                amberGlow:
                    'bg-[#feb600] text-[#0f172a] font-bold hover:bg-[#e0a100] shadow-[0_0_20px_rgba(254,182,0,0.35)]',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-11 rounded-lg px-6 text-sm font-semibold',
                xl: 'h-12 rounded-xl px-8 text-base font-bold',
                icon: 'h-9 w-9 p-0',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
