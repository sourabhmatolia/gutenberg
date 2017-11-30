/**
 * External dependencies
 */
import { repeat, identity } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import { registerBlockType } from '../../api';
import RangeControl from '../../inspector-controls/range-control';
import BlockChildren from '../../block-children';
import InspectorControls from '../../inspector-controls';
import BlockDescription from '../../block-description';

function mapChildren( children, columns, callback ) {
	return columns.map( ( endOffset, index ) => {
		const startOffset = columns[ index - 1 ] || 0;
		return callback( children.slice( startOffset, endOffset ), index );
	} );
}

registerBlockType( 'core/columns', {
	title: __( 'Columns' ),

	icon: 'columns',

	category: 'layout',

	attributes: {
		columns: {
			type: 'array',
			default: [ 1, 2 ],
		},
	},

	getEditWrapperProps() {
		return { 'data-align': 'wide' };
	},

	edit( { attributes, setAttributes, setChildren, children, className, focus } ) {
		const { columns } = attributes;

		const setChildFragment = ( index ) => ( nextChildren ) => {
			const fragmented = mapChildren( children, columns, identity );
			const origNumChildren = fragmented[ index ].length;
			fragmented.splice( index, 1, nextChildren );

			let runningOffset = 0;
			const nextColumns = [];
			const allNextChildren = [];
			fragmented.forEach( ( childSet, childSetIndex ) => {
				runningOffset += childSet.length;
				if ( childSetIndex > index ) {
					runningOffset += nextChildren.length - origNumChildren;
				}

				nextColumns.push( runningOffset );
				allNextChildren.push( ...childSet );
			} );

			setAttributes( { columns: nextColumns } );
			setChildren( allNextChildren );
		};

		const setNextColumnsCount = ( count ) => {
			const nextColumns = count < columns.length ?
				// Take first X of columns...
				columns.slice( 0, count ) :
				// ...or fill with new columns
				[ ...columns, repeat( count - columns.length, () => [] ) ];

			if ( count < columns.length ) {
				// When trimming columns, reassign children to encompass only
				// those up to the now-last column.

				// TODO: Ideally we'd simply flatten eliminated columns into
				// the last available column, which is simply assigning the new
				// last column to have child length as its final offset, but
				// this is made difficult by the fact that we'd need to reset
				// the block state of the rendered BlockChildren.
				const lastChildIndex = nextColumns[ nextColumns.length - 1 ];
				setChildren( children.slice( 0, lastChildIndex ) );
			}

			setAttributes( { columns: nextColumns } );
		};

		return [
			focus && (
				<InspectorControls key="inspector">
					<BlockDescription>
						<p>{ __( 'A multi-column layout of content.' ) }</p>
					</BlockDescription>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns.length }
						onChange={ setNextColumnsCount }
						min={ 2 }
						max={ 4 }
					/>
				</InspectorControls>
			),
			<div className={ className } key="container">
				{ mapChildren( children, columns, ( childSet, index ) => (
					<BlockChildren
						key={ index }
						value={ childSet }
						onChange={ setChildFragment( index ) }
					/>
				) ) }
			</div>,
		];
	},

	save( { attributes, children } ) {
		const { columns } = attributes;

		return (
			<div>
				{ mapChildren( children, columns, ( childSet, index ) => (
					<BlockChildren.Content
						key={ index }
						value={ childSet }
					/>
				) ) }
			</div>
		);
	},
} );
