/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { keycodes } from '@wordpress/utils';

/**
 * Internal dependencies
 */
import './style.scss';

const { ESCAPE } = keycodes;

function ReusableBlockEditPanel( props ) {
	const { isEditing, name, isSaving, onEdit, onDetach, onChangeName, onSave, onCancel } = props;

	return [
		( ! isEditing && ! isSaving ) && (
			<div key="view" className="reusable-block-edit-panel">
				<span className="reusable-block-edit-panel__info">
					<b>{ name }</b>
				</span>
				<Button
					isLarge
					className="reusable-block-edit-panel__button"
					onClick={ onEdit }>
					{ __( 'Edit' ) }
				</Button>
				<Button
					isLarge
					className="reusable-block-edit-panel__button"
					onClick={ onDetach }>
					{ __( 'Detach' ) }
				</Button>
			</div>
		),
		( isEditing || isSaving ) && (
			<form
				key="edit"
				className="reusable-block-edit-panel"
				onSubmit={ ( event ) => {
					event.preventDefault();
					onSave();
				} }>
				<input
					type="text"
					disabled={ isSaving }
					className="reusable-block-edit-panel__name"
					value={ name }
					onChange={ ( event ) => onChangeName( event.target.value ) }
					onKeyDown={ ( event ) => {
						if ( event.keyCode === ESCAPE ) {
							event.stopPropagation();
							onCancel();
						}
					} } />
				<Button
					type="submit"
					isPrimary
					isLarge
					isBusy={ isSaving }
					disabled={ ! name || isSaving }
					className="reusable-block-edit-panel__button"
					onClick={ onSave }>
					{ __( 'Save' ) }
				</Button>
				<Button
					isLarge
					disabled={ isSaving }
					className="reusable-block-edit-panel__button"
					onClick={ onCancel }>
					{ __( 'Cancel' ) }
				</Button>
			</form>
		),
	];
}

export default ReusableBlockEditPanel;

