import { Mic } from 'lucide-react';

export const MobileSearchBar = () => {
    return (
        <div className="mx-4 bg-[#ffffff] rounded-full h-12 flex items-center px-4 shadow-lg">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 mr-3">
                G
            </div>
            {/* Or use Google Icon SVG if available, but G text is fine for simplified */}

            <input
                type="text"
                placeholder=""
                className="flex-1 bg-transparent border-none outline-none text-black/80"
                disabled
            />

            <div className="flex items-center gap-3 text-gray-500">
                <Mic size={20} />
                {/* <Camera size={20} /> */}
            </div>
        </div>
    );
};
