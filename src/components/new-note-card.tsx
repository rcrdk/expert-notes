import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import {
	ChangeEvent,
	FormEvent,
	KeyboardEvent,
	useEffect,
	useState,
} from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
	onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
	const [showDialog, setShowDialog] = useState(false)

	const [showBoarding, setShowOnboarding] = useState(true)
	const [isRecording, setIsRecording] = useState(false)
	const [content, setContent] = useState('')

	function handleStartEditor() {
		setShowOnboarding(false)
	}

	function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value)

		if (event.target.value === '') {
			setShowOnboarding(true)
		}
	}

	function handleContentKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (content === '' && event.key === 'Backspace') {
			setShowOnboarding(true)
		}
	}

	function handleNoteSubmit(event: FormEvent) {
		event.preventDefault()
	}

	function handleSaveNote() {
		if (content === '') return

		onNoteCreated(content)
		setContent('')
		setShowOnboarding(true)

		toast.success('Nota criada com sucesso!')
	}

	function handleStartRecording() {
		const isSpeechRecognitionAPIAvailable =
			'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

		if (!isSpeechRecognitionAPIAvailable) {
			toast.error('Seu navegador não suporta esta funcionalidade')
			return
		}

		setIsRecording(true)
		setShowOnboarding(false)

		const SpeechRecognitionAPI =
			window.SpeechRecognition || window.webkitSpeechRecognition

		speechRecognition = new SpeechRecognitionAPI()

		speechRecognition.lang = 'pt-BR'
		speechRecognition.continuous = true
		speechRecognition.maxAlternatives = 1
		speechRecognition.interimResults = true

		speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript)
			}, '')

			setContent(transcription)
		}

		speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			console.error(event)
			toast.error('Aconteceu um erro durante a gravação')
			setIsRecording(false)
		}

		speechRecognition.start()
	}

	function handleStopRecording() {
		setIsRecording(false)

		if (speechRecognition) {
			speechRecognition.stop()
		}
	}

	useEffect(() => {
		setShowOnboarding(true)
		setIsRecording(false)
		setContent('')
		handleStopRecording()
	}, [showDialog])

	return (
		<Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
			<Dialog.Trigger className="flex flex-col gap-3 rounded-md bg-slate-700 p-5 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
				<span className="text-sm font-medium text-slate-200">
					Adicionar nota
				</span>
				<p className="text-sm leading-6 text-slate-400">
					Grave uma nota em áudio que será convertida para texto
					automaticamente.
				</p>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50" />

				<Dialog.Content className="fixed inset-5 flex flex-col overflow-auto rounded-md bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:w-full md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2">
					<Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
						<X className="size-5" />
					</Dialog.Close>

					<form onSubmit={handleNoteSubmit} className="flex flex-1 flex-col">
						<div className="flex flex-1 flex-col gap-3 p-5">
							<span className="text-sm font-medium text-slate-300">
								Adicionar nota
							</span>

							{showBoarding ? (
								<p className="text-sm leading-6 text-slate-400">
									Comece{' '}
									<button
										type="button"
										className="font-medium text-lime-400 hover:underline"
										onClick={handleStartRecording}
									>
										gravando uma nota
									</button>{' '}
									em áudio ou se preferir{' '}
									<button
										type="button"
										className="font-medium text-lime-400 hover:underline"
										onClick={handleStartEditor}
									>
										utilize apenas texto
									</button>
									.
								</p>
							) : (
								<textarea
									autoFocus
									className="flex-1 resize-none bg-transparent text-sm leading-6 text-slate-400 outline-none disabled:cursor-wait"
									onChange={handleContentChanged}
									onKeyDown={handleContentKeyDown}
									value={content}
									disabled={isRecording}
								/>
							)}
						</div>

						{isRecording ? (
							<button
								type="button"
								className="flex w-full items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm font-medium text-slate-300 outline-none hover:text-slate-100"
								onClick={handleStopRecording}
							>
								<div className="size-3 animate-pulse rounded-full bg-red-500" />
								Gravando (clique p/ interromper)
							</button>
						) : (
							<button
								type="button"
								className="w-full bg-lime-400 py-4 text-center text-sm font-medium text-lime-950 outline-none hover:bg-lime-500 disabled:pointer-events-none disabled:bg-slate-600 disabled:text-slate-800"
								onClick={handleSaveNote}
								disabled={content === '' || showBoarding}
							>
								Salvar nota
							</button>
						)}
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
