export default function Footer() {
    return (
        <footer className="bg-card/80 border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-xs sm:text-sm text-foreground/60 tracking-wide">
                    © {new Date().getFullYear()} FiTrack
                </p>
            </div>
        </footer>
    );
}