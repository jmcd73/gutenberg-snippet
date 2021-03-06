/**
 * Edit controller
 *
 * @since 1.0.0
 */
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	TextareaControl,
	TextControl,
	ToggleControl,
	Toolbar,
} from '@wordpress/components';
import { InspectorControls, BlockControls } from '@wordpress/editor';
import '../../utils/hack-highlight';
import Highlight from './components/highlight';

const languages = [
	{ label: __( 'Select a language', 'sw-snippet' ), value: '' },
	{ label: 'Apache', value: 'apache' },
	{ label: 'Bash', value: 'bash' },
	{ label: 'C#', value: 'csharp' },
	{ label: 'C++', value: 'cpp' },
	{ label: 'CSS', value: 'css' },
	{ label: 'Erlang', value: 'erlang' },
	{ label: 'Go', value: 'golang' },
	{ label: 'HTML', value: 'html' },
	{ label: 'XML', value: 'xml' },
	{ label: 'Handlebars', value: 'handlebars' },
	{ label: 'JSON', value: 'json' },
	{ label: 'Java', value: 'java' },
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'Markdown', value: 'markdown' },
	{ label: 'Objective C', value: 'objectivec' },
	{ label: 'PHP', value: 'php' },
	{ label: 'Python', value: 'python' },
	{ label: 'Plain Text', value: 'plaintext' },
	{ label: 'R', value: 'r' },
	{ label: 'Ruby', value: 'ruby' },
	{ label: 'Rust', value: 'rust' },
	{ label: 'SCSS', value: 'scss' },
	{ label: 'SQL', value: 'sql' },
	{ label: 'Shell', value: 'shell' },
	{ label: 'Twig', value: 'twig' },
	{ label: 'TypeScript', value: 'typescript' },
	{ label: 'NGINX', value: 'nginxconf' },
];

/**
 * Edit block component
 *
 * @since 1.0.0
 */
export default class BlockEdit extends Component {
	/**
	 * Constructor
	 *
	 * @param {object} props React props
	 */
	constructor( props ) {
		super( props );
		this.state = {
			preview: false,
		};
	}

	/**
	 * Renderer
	 *
	 * @return {jsx}
	 */
	render() {
		const {
			attributes,
			className,
			isSelected,
			setAttributes,
		} = this.props;
		const {
			content,
			copyLabelCopyButton,
			copiedLabelCopyButton,
			language,
			saveParsed,
			showCopyButton,
			showLineNumbers,
		} = attributes;

		const controls = this.state.preview ?
			[
				{
					icon: 'edit',
					title: __( 'Edit', 'sw-snippet' ),
					onClick: () => this.setState( { preview: false } ),
				},
			] :
			[
				{
					icon: 'visibility',
					title: __( 'Preview', 'sw-snippet' ),
					onClick: () => this.setState( { preview: true } ),
				},
			];

		const classNames = [ language ];
		if ( showLineNumbers ) {
			classNames.push( 'sw_show_line_numbers' );
		}

		return (
			<div className={ className }>
				<InspectorControls>
					<PanelBody
						title={ __( 'Snippet Settings', 'sw-snippet' ) }
					>
						<SelectControl
							label={ __( 'Language', 'sw-snippet' ) }
							value={ language }
							options={ languages }
							onChange={ value => setAttributes( { language: value } ) }
						/>
						<ToggleControl
							label={ __( 'Add Copy button', 'sw-snippet' ) }
							checked={ showCopyButton }
							onChange={ value => setAttributes( { showCopyButton: value } ) }
						/>
						{ showCopyButton && [
							<TextControl
								key="copy-label"
								label={ __( '\'Copy\' label', 'sw-snippet' ) }
								value={ copyLabelCopyButton }
								onChange={ value => setAttributes( { copyLabelCopyButton: value } ) }
							/>,
							<TextControl
								key="copied-label"
								label={ __( '\'Copied\' label', 'sw-snippet' ) }
								value={ copiedLabelCopyButton }
								onChange={ value => setAttributes( { copiedLabelCopyButton: value } ) }
							/>,
						] }
						<ToggleControl
							label={ __( 'Save formatted content', 'sw-snippet' ) }
							help={ __( 'Code snippet content will saved as HTML', 'sw-snippet' ) }
							checked={ saveParsed }
							onChange={ value => setAttributes( { saveParsed: value } ) }
						/>
						<ToggleControl
							label={ __( 'Show line numbers', 'sw-snippet' ) }
							checked={ showLineNumbers }
							onChange={ value => setAttributes( { showLineNumbers: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<BlockControls>
					<Toolbar
						controls={ controls }
					/>
				</BlockControls>

				{ isSelected && ! this.state.preview && <TextareaControl
					value={ content }
					onChange={ value => setAttributes( { content: value } ) }
				/> }
				{ ( ! isSelected || this.state.preview ) &&
					<Fragment>
						{ showCopyButton &&
							<button className="sw-snippet-button">
								{ copyLabelCopyButton }
							</button>
						}

						<Highlight className={ classNames.join( ' ' ) }>
							{ content }
						</Highlight>
					</Fragment>
				}
			</div>
		);
	}
}
