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
		! isEditing && ! isSaving && <div className="reusable-block-edit-panel">
			<span key="info" className="reusable-block-edit-panel__info">
				<b>{ name }</b>
			</span>
			<Button
				key="edit"
				isLarge
				className="reusable-block-edit-panel__button"
				onClick={ onEdit }>
				{ __( 'Edit' ) }
			</Button>
			<Button
				key="detach"
				isLarge
				className="reusable-block-edit-panel__button"
				onClick={ onDetach }>
				{ __( 'Detach' ) }
			</Button>
		</div>,
		( isEditing || isSaving ) && (
			<form
				className="reusable-block-edit-panel"
				onSubmit={ ( event ) => {
					event.preventDefault();
					onSave();
				} }>
				<input
					key="name"
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
					key="save"
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
					key="cancel"
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

