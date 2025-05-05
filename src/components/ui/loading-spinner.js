// components/ui/loading-spinner.js
import {motion} from 'framer-motion';

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <motion.div
                animate={{rotate: 360}}
                transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
            />
            <p className="mt-4 text-gray-500">Searching stealer data...</p>
        </div>
    );
}
