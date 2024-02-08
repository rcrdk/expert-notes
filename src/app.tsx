import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

import brand from '@/assets/brand-2.svg'
import { NewNoteCard } from '@/components/new-note-card'
import { NoteCard } from '@/components/note-card'

export interface Note {
	id: string
	date: Date
	content: string
}

export function App() {
	const [search, setSearch] = useState('')

	const [notes, setNotes] = useState<Note[]>(() => {
		const localNotes = localStorage.getItem('@nlw-note-card:notes:1.0.0')

		if (localNotes) {
			return JSON.parse(localNotes)
		}

		return []
	})

	function onNoteCreated(content: string) {
		const newNote = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		}

		const notesArray: Note[] = [newNote, ...notes]

		setNotes(notesArray)

		localStorage.setItem(
			'@nlw-note-card:notes:1.0.0',
			JSON.stringify(notesArray),
		)
	}

	function onNoteDeleted(id: string) {
		const notesArray = notes.filter((note) => {
			return note.id !== id
		})

		setNotes(notesArray)

		localStorage.setItem(
			'@nlw-note-card:notes:1.0.0',
			JSON.stringify(notesArray),
		)

		toast.error('Nota excluida com sucesso')
	}

	function handleSearchSubmit(event: FormEvent) {
		event.preventDefault()
	}

	function handleSearch(event: ChangeEvent<HTMLInputElement>) {
		const query = event.target.value

		setSearch(query)
	}

	const filteredNotes =
		search !== ''
			? notes.filter((note) =>
					note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
				)
			: notes

	return (
		<div className="px-x mx-auto my-12 max-w-6xl space-y-6 px-5 md:px-7 xl:px-0">
			<img src={brand} alt="NLW Expert" />
			<form onSubmit={handleSearchSubmit} className="w-full">
				<input
					type="text"
					placeholder="Busque em suas notas..."
					className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-500 md:text-3xl"
					onChange={handleSearch}
					value={search}
				/>
			</form>

			<div className="h-px bg-slate-700" />

			<div className="grid auto-rows-[180px] grid-cols-1 gap-6 md:auto-rows-[250px] md:grid-cols-2 lg:grid-cols-3">
				<NewNoteCard onNoteCreated={onNoteCreated} />

				{filteredNotes.map((note) => (
					<NoteCard note={note} onNoteDeleted={onNoteDeleted} key={note.id} />
				))}
			</div>
		</div>
	)
}
