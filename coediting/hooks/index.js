/**
 * External dependency
 */
import { connect } from 'react-redux';

/**
 * WordPress dependency
 */
import { BlockEdit, getBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { getWrapperDisplayName } from '@wordpress/element';

/**
 * Internal dependency
 */
import './style.scss';
// TODO: Move selectors to the local folder
import {
	getFrozenBlockCollaboratorColor,
	getFrozenBlockCollaboratorName,
	isBlockFrozenByCollaborator,
} from '../store';

const withFrozenMode = ( BloclListBlock ) => {
	const WrappedBlockItem = ( { collaboratorColor, collaboratorName, isFrozenByCollaborator, ...props } ) => {
		if ( ! isFrozenByCollaborator ) {
			return <BloclListBlock { ...props } />;
		}

		const { block } = props;
		const { attributes, name, isValid, uid } = block;
		const blockType = getBlockType( name );

		// Determine whether the block has props to apply to the wrapper.
		let wrapperProps;
		if ( blockType.getEditWrapperProps ) {
			wrapperProps = blockType.getEditWrapperProps( attributes );
		}

		return (
			<div
				className={ `editor-block-list__block is-frozen-by-collaborator is-${ collaboratorColor }` }
				{ ...wrapperProps }
			>
				<legend className="coediting-legend">{ collaboratorName }</legend>
				<div className="editor-block-list__block-edit">
					{ isValid && <BlockEdit
						attributes={ attributes }
						id={ uid }
						name={ name }
					/> }
				</div>
			</div>
		);
	};
	WrappedBlockItem.displayName = getWrapperDisplayName( BloclListBlock, 'frozen-mode' );

	const mapStateToProps = ( state, { uid } ) => ( {
		collaboratorColor: getFrozenBlockCollaboratorColor( state, uid ),
		collaboratorName: getFrozenBlockCollaboratorName( state, uid ),
		isFrozenByCollaborator: isBlockFrozenByCollaborator( state, uid ),
	} );

	return connect( mapStateToProps )( WrappedBlockItem );
};

addFilter( 'editor.BlockListBlock', 'coediting/block-item/frozen-mode', withFrozenMode );
