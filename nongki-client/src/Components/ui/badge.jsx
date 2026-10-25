/* eslint-disable react-refresh/only-export-components */
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-[#feb600] text-[#0f172a] shadow',
                secondary:
                    'border-slate-700 bg-slate-800 text-slate-200',
                destructive:
                    'border-red-500/30 bg-red-500/10 text-red-400',
                outline:
                    'border-slate-700 text-slate-300',
                amber:
                    'border-[#feb600]/30 bg-[#feb600]/15 text-[#feb600]',
                emerald:
                    'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
