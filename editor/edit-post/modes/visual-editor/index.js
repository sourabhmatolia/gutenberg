/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import './style.scss';
import { BlockList, PostTitle, WritingFlow, DefaultBlockAppender, EditorGlobalKeyboardShortcuts } from '../../../components';
import VisualEditorInserter from './inserter';
import { isFeatureActive } from '../../../selectors';
import { clearSelectedBlock } from '../../../actions';

function VisualEditor( { hasFixedToolbar } ) {
	return (
		<div className="editor-visual-editor">
			<EditorGlobalKeyboardShortcuts />
			<WritingFlow>
				<PostTitle />
				<BlockList showContextualToolbar={ ! hasFixedToolbar } />
				<DefaultBlockAppender />
			</WritingFlow>
			<VisualEditorInserter />
		</div>
	);
}

export default connect(
	( state ) => {
		return {
			hasFixedToolbar: isFeatureActive( state, 'fixedToolbar' ),
		};
	},
	{
		clearSelectedBlock,
	}
)( VisualEditor );
