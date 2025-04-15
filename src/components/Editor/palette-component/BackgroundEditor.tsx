import React, { useRef } from 'react';

interface Props {
	backgroundImage: string | null;
	onBackgroundImageChange: (image: string) => void;
}

const BackgroundEditor: React.FC<Props> = ({
	backgroundImage,
	onBackgroundImageChange
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				onBackgroundImageChange(result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div style={{marginBottom: '12px'}}>
			<label
				htmlFor="background-image"
				style={wrapperStyle}
				onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
				onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
			>
				{backgroundImage ? 'Change Image' : 'Choose Image'}
			</label>
			<input
				id="background-image"
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				style={{display: 'none'}}
			/>
		</div>
	)
}

const wrapperStyle = {
	display: 'block',
	padding: '10px 12px',
	borderRadius: '4px',
	border: '1px solid #ccc',
	backgroundColor: '#f0f0f0',
	cursor: 'pointer',
	textAlign: 'center',
	transition: 'background-color 0.2s',
	color: '#555',
} as const;

export default BackgroundEditor;