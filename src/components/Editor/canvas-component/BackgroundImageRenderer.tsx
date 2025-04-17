import React from 'react';

interface Props {
	backgroundImage?: string | null;
}

const BackgroundImageRenderer: React.FC<Props> = ({
	backgroundImage = null
}) => {
	if(backgroundImage) {
		return (
			<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: 0,
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: '100% 100%',
				backgroundRepeat: 'no-repeat',
			}}
		/>);
	} else {
		return null;
	}
}

export default BackgroundImageRenderer;