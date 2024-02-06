import brand from '@/assets/brand-2.svg'
import { NewNoteCard } from '@/components/new-note-card'
import { NoteCard } from '@/components/note-card'

const note = {
	date: new Date(2022, 4, 1),
	content:
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quae iure sunt dolorem voluptatibus omnis recusandae nisi architecto quas animi sed provident saepe fuga repellendus consequuntur dolorum, nesciunt earum voluptates!',
}

export function App() {
	return (
		<div className="mx-auto my-12 max-w-6xl space-y-6">
			<img src={brand} alt="NLW Expert" />
			<form className="w-full">
				<input
					type="text"
					placeholder="Busque em suas notas..."
					className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
				/>
			</form>

			<div className="h-px bg-slate-700" />

			<div className="grid auto-rows-[250px] grid-cols-3 gap-6">
				<NewNoteCard />

				<NoteCard note={note} />
			</div>
		</div>
	)
}
