import { createPlan } from "../actions";

export default function NewPlanPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 max-w-3xl py-10">
            <div className="border-b border-[var(--border)] pb-4 mb-6">
                <h1 className="text-2xl font-semibold">Create a new business plan</h1>
                <p className="text-[var(--muted)]">
                    A plan contains all your business files, including the revision history.
                </p>
            </div>

            <form action={createPlan} className="space-y-6">
                {/* Owner / Repository Name */}
                <div className="bg-[var(--canvas-subtle)] p-4 rounded-md border border-[var(--border)] flex items-end gap-2 mb-6">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-semibold">Owner</label>
                        <div className="bg-[var(--canvas-default)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--muted)] cursor-not-allowed">
                            Your Name
                        </div>
                    </div>

                    <span className="text-xl text-[var(--muted)] mb-1">/</span>

                    <div className="flex flex-col gap-2 flex-[2]">
                        <label htmlFor="name" className="text-sm font-semibold">Plan name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="bg-[var(--canvas-default)] border border-[var(--border)] rounded px-3 py-1.5 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 outline-none w-full"
                            placeholder="my-awesome-startup"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-sm font-semibold">Description <span className="text-[var(--muted)] font-normal">(optional)</span></label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="bg-[var(--canvas-default)] border border-[var(--border)] rounded px-3 py-1.5 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 outline-none w-full"
                    />
                </div>

                <div className="border-t border-[var(--border)] my-4"></div>

                {/* Visibility */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <input type="radio" name="visibility" value="public" id="public" defaultChecked className="mt-1" />
                        <div>
                            <label htmlFor="public" className="font-semibold block text-sm">Public</label>
                            <p className="text-xs text-[var(--muted)]">Anyone on the internet can see this repository. You choose who can commit.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <input type="radio" name="visibility" value="private" id="private" className="mt-1" />
                        <div>
                            <label htmlFor="private" className="font-semibold block text-sm">Private</label>
                            <p className="text-xs text-[var(--muted)]">You choose who can see and commit to this repository.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[var(--border)] my-6"></div>

                <button type="submit" className="bg-[#238636] text-white font-semibold py-1.5 px-4 rounded-md hover:bg-[#2ea043] transition-colors text-sm">
                    Create plan
                </button>
            </form>
        </div>
    );
}
