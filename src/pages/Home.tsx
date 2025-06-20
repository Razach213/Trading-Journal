import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth"; // Missing hook call removed

const features = [
    "Track your trades with detailed entry and exit points.",
    "Analyze your performance with advanced metrics.",
    "Keep a journal with notes and screenshots for every trade.",
    "Set and track your trading goals.",
    "Secure and private, your data is your own.",
];

const Home = () => {
    // const { user } = useAuth(); // Missing hook call removed

    return (
        <div className="bg-white dark:bg-gray-900">
            <main>
                {/* Hero section */}
                <div className="relative">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100 dark:bg-gray-800" />
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply" />
                            </div>
                            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                                <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                    <span className="block text-white">The Trading Journal</span>
                                    <span className="block text-indigo-200">Built for Winners</span>
                                </h1>
                                <p className="mx-auto mt-6 max-w-lg text-center text-xl text-indigo-100 sm:max-w-3xl">
                                    Track, analyze, and improve your trading performance with the most advanced trading journal platform. Join thousands of successful traders who trust Zellax.
                                </p>
                                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                                    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                                        <Link
                                            to="/signup"
                                            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8"
                                        >
                                            Get started
                                        </Link>
                                        <Link
                                            to="/features"
                                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8"
                                        >
                                            Live demo
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature section */}
                <div className="relative bg-white dark:bg-gray-900 py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
                        <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Everything you need</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            All-in-one platform
                        </p>
                        <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500 dark:text-gray-400">
                            A trading journal is one of the most effective tools for improving your trading performance. Here's what Zellax offers.
                        </p>
                        <div className="mt-12">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature) => (
                                    <div key={feature} className="pt-6">
                                        <div className="flow-root rounded-lg bg-gray-50 dark:bg-gray-800 px-6 pb-8">
                                            <div className="-mt-6">
                                                <div>
                                                    <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                                                        <CheckCircle2 className="h-6 w-6 text-white" aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <p className="mt-5 text-base text-gray-700 dark:text-gray-300">
                                                    {feature}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
