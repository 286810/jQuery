(function ( window, undefined) {
	
	var jQuery = (function () {
		
		var jQuery = function ( selector, context ) {
			return new jQuery.fn.init( selector, context, rootjQuery );
		},
		
		//Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
		
		//Map over $ in case of overweite
		_$ = window.$,
				
		//������ selector ��������ʽ
		quickExpr = /(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
				
		//save a reference to some core methods
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty,
		push = Array.prototype.push,
		slice = Array.prototype.slice,
		trim = String.prototype.trim,
		indexOf = Array.prototype.indexOf;		
		
		jQuery.fn = jQuery.prototype = {
			//ָ���캯�� jQuery
			constructor: jQuery,
			/*
			 * selector���������������͵�ֵ����ֻ�� undefined��DOMԪ�ء��ַ�����������jQuery������ͨJS��������Ч��
			 * context�����Բ����룬����DOMԪ�ء�jQuery������ͨJS����
			 * rootjQuery�������� document ����� jQuery ����
			 */
			init: function ( selector, context, rootjQuery ) {
				var match, elem, ret, doc;
				//����� undefined��null �ȣ�ֱ�ӷ��� this--->�� jQuery ����
				if ( !selector ) {
					return this;
				}
				//��������� nodeType������Ϊ selector �� DOM Ԫ��
				if ( selector.nodeType ) {
					this.context = this[0] = selector;
					this.length = 1;
					return this;
				}
				//������ַ��� ��body��
				if ( slector === 'body' ) {
					this.context = document;
					this[0] = document.body;
					this.length = 1;
					return this;
				}
				//����������ַ������ȼ���� HTML ���룬���� #id
				if ( typeof selector === 'string' ) {
					//HTML ����
					if ( selector.charAt(0) === '<' && selector.charAt( selector.length - 1 ) === '>' && selector.length >= 3 ) {
						match = [ null, selector, null ];
					} else {
						match = quickExpr.exec( selector );
					}
					//�Ǹ��� HTML ����
					if ( match && (match[1] || !context) ) {
						
						//HANDLE: $(html)->$(array)
						if ( match[1] ) {
							context = context instanceof jQuery ? context[0] : context;
							doc = ( context ? context.ownerDocument || context : document );
							
							//������ǩ
							ret = rsingleTag.exec( selector );
							
							if ( ret ) {
								if ( jQuery.isPlainObject( context ) ) {
									selector = [ document.createElement( ret[1] ) ];
									jQuery.fn.attr.call ( selector, context, true );
									
								} else {
									selector = [ doc.createElement( ret[1] ) ];
								}
								
							} else {
								ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
								selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
							}
							
							return jQuery.merge( this, selector );
							//HANDLE: $('#id')	 #id ����δָ�� context
						} else {
							elem = document.getElementById( match[2] );
							
							if ( elem && elem.parnetNode ) {
								//����IE6��7��ĳЩ�汾�� Opera �����ú��ķ��� getElementById() ���ᰴ���� name ���Ҷ����� id �� bug
								if ( elem.id !== match[2] ) {
									return rootjQuery.find( selector );
								}
								
								this.length = 1;
								this[0] = elem;
							}
							
							this.context = document;
							this.selector = selectot;
							return this;
						}
						
					//��ѡ�������ʽ	
					} else if ( !context || context.jquery ) {
						return ( context || rootjQuery ).find( selector );
					} else {
						return this.constructor( context ).find( selector );
					}
					
				//�Ǻ���
				} else if ( jQuery.isFunction( selector ) ) {
					return rootjQuery.ready( selector );
				}
				
				//�� jQuery ����
				if ( selector.selector !== undefined ) {
					this.selector = selector.selector;
					this.context = selector.context;
				}
				//����������ֵ
				return jQuery.makeArray( selector, this );
			},
			//ѡ�������ʽ
			selector: '',
			//�汾��
			jquery: '1.7.1',
			//��ǰ jQuery ������Ԫ�صĸ���
			length: 0,
			//���ص�ǰ jQuery ������Ԫ�صĸ���
			size: function () {
				return this.length;
			},
			//����ǰ jQuery ����ת��������������
			toArray: function () {
				return slice.call( this, 0 );
			},
			//����ָ��λ�õ�Ԫ�ػ����������Ԫ�ص�����
			get: function ( num ) {
				return num === null ?
					//���û�д������
					this.toArray() :
					//�������ֵ����Ϊ����
					( num < 0 ? this[ this.length + num ] : this[ num ] );
			},
			//��ջ������һ���µĿ� jQuery ����Ȼ��� DOM Ԫ�ؼ��Ϸ�����������У��������Ե�ǰ jQuery ���������
			pushStack: function ( elems, name, selector ) {
				var ret = this.constructor();
				
				if ( jQuery.isArray( elems ) ) {
					push.apply( ret, elems );
				} else {
					jQuery.merge( ret, elems );
				}
				
				//����һ���µ� jQuery ������ջ
				ret.prevObject = this;
				
				ret.context = this.context;
				
				if ( name === 'find' ) {
					ret.selector = this.selector + ( this.selector ? '' : '' ) + selector;
				} else if ( name ) {
					ret.selector = this.selector + '.' + name + '(' + selector + ')';
				}
				
				return ret;
			},
			//������ǰ jQuery ���󣬲���ÿ��Ԫ����ִ�лص�����
			each: function ( callback, args ) {
				return jQuery.each( this, callback, args );
			},
			//������ǰ jQuery ������ÿ��Ԫ����ִ�лص������������ص������ķ���ֵ����һ���µ� jQuery ������
			map: function ( callback ) {
				return this.pushStack( jQuery.map(this, function( elem, i ) {
					return callback.call( elem, i, elem );
				}));
			},
			//��ջ��������ǰ�����������ɸѡ����������ƥ��Ԫ�ؼ��ϻ�ԭΪ֮ǰ��״̬
			end: function () {
				//����ǰһ�� jQuery ������������ڣ��򹹽�һ���յ� jQuery ���󷵻�
				return this.prevObject || this.constructor(null);
			},
			//��ƥ��Ԫ�ؼ�������Ϊ������ָ��λ�õ�Ԫ��
			eq: function( i ) {
				//����������ַ������� + �ŰѸò���ת������ֵ
				i = +i;
				return i === -1 ?
					this.slice( i ) :
					this.slice( i, i + 1 );
			},
			//��ƥ��Ԫ�ؼ�������Ϊ�����е�һ��Ԫ��
			first: function() {
				return this.eq( 0 );
			},
			//��ƥ��Ԫ�ؼ�������Ϊ���������һ��Ԫ��
			last: function() {
				return this.eq( -1 );
			},
			//��ƥ��Ԫ�ؼ�������Ϊ������ָ����Χ���Ӽ�
			slice: function() {
				return this.pushStack( slice.apply( this, arguments ),
															'slice', slice.call(arguments).join(',') );
			},
			//��ǰ jQuery �����ĩβ�����Ԫ�أ��������³���
			push: push,
			//�Ե�ǰ jQuery �����е�Ԫ�ؽ�������
			sort: [].sort,
			//��ǰ jQuery �����в��롢ɾ�����滻Ԫ�أ����ɾ����Ԫ�أ��򷵻غ��б�ɾ��Ԫ�ص�����
			splice: [].splice
		};
		
		jQuery.fn.init.prototype = jQuery.prototype;
		
		jQuery.extend = jQuery.fn.extend = function () {
			//�������
			//ָ��ĳ��Դ���󡢱�ʾĳ��Դ�����ĳ������������ʾĿ������ĳ�����Ե�ԭʼֵ����ʾĳ��Դ�����ĳ�����Ե�ֵ��
			//ָʾ���� copy �Ƿ������顢��ʾ��ȸ���ʱԭʼֵ������ֵ��Ŀ����� ��ʾԴ�������ʼ�±ꡢ
			//��ʾ�����ĸ����������������� target ��ָʾ�Ƿ�ִ����ȸ��ƣ�Ĭ��Ϊ false 
			var options, name, src, copy, copyIsArray, clone,
					target = arguments[0] || {},
					i = 1,
					length = arguments.length,
					deep = false;					
			//�����һ�������ǲ���ֵ��������Ϊ deep �������ڶ���ΪĿ����� target��������Դ����ӵ�����Ԫ�ؿ�ʼ
			if ( typeof target === 'boolean' ) {
				deep = arguments[0];
				target = arguments[1] || {};
				i = 2;
			}
			//������ַ���
			if ( typeof target !== 'object' && !jQuery.isFunction(target)) {
				target = {};
			}
			//���ֻ��һ����������� jQuery ��ΪĿ�����
			if ( length === i ) {
				target = this;
				--i;
			}
			
			for ( ; i < length; i++ ) {
				//���ж�Դ�����ǲ��� null��undefined���ѻ�ȡԴ����Ͷ�Դ������жϺϲ�Ϊһ�����
				if ( (optinos = arguments[i]) != null ) {
					//����Դ���������
					for ( name in options ) {
						//���� src ��ԭʼֵ��copy �Ǹ���ֵ���������ֵ copy ��Ŀ����� target ��ȣ�Ϊ�˱������ʱ��ѭ������˲��Ḳ��Ŀ������ͬ������
						src = target[name];
						copy = options[name];
						//��ֹ��ѭ��
						if ( target === copy ) {
							continue;	
						}
						//�������Ⱥϲ����Ҹ���ֵ copy ����ͨ js ��������飬��ݹ�ϲ�
						if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
							if ( copyIsArray ) {
								//��� copy �����飬��ԭʼֵ src ���ǣ�������Ϊ�����飻��� copy �Ƕ��󣬶� src ���ǣ�������Ϊ�ն��� {}
								//��ԭʼֵ src ���������ֵ��ֵ��ԭʼֵ���� clone
								copyIsArray = false;
								clone = src && jQuery.isArray(src) ? src : [];
							} else {
								clone = src && jQuery.isPlainObject(src) ? src : {};
							}
							//�Ѹ���ֵ copy �ݹ�ϲ���ԭʼֵ���� clone �У�Ȼ�󸲸�Ŀ������ͬ������
							target[name] = jQuery.extend( deep, clone, copy );
						} else if ( copy !== undefined ) {
						//���������Ⱥϲ�����ֱ�Ӹ���Ŀ������ͬ������
							target[name] = copy;
						}
					}
				}
			}
			
			return target;
		};
		
		jQuery.extend({
			//�ͷ� $ ����ֹ��ͻ
			
			//���ͼ��
			//�Ƿ���
			
			//�Ƿ�����
			
			//jQuery.type
			
			//�Ƿ� window
			
			//�Ƿ�����
			
			//�Ƿ��Ǵ���Ķ���
			
			//�����Ƿ��ǿյ�
			
			//���� json
			
			//���� xml
			
			//��ȫ����������ִ�� js ����
			
			//ת�����ַ�Ϊ�շ�ʽ
			
			//��� DOM Ԫ�صĽڵ�����
			
			//������ǰ jQuery ���󣬲���ÿ��Ԫ����ִ�лص�����
			each: function ( object, callback, args ) {
				var name, i = 0,
						length = object.length,
						isObj = length === undefined || jQuery.isFunction( object );
				
				if ( args ) {
					if ( isObj ) {
						for ( name in object ) {
							if ( callback.apply( object[ name ], args ) === false ) {
								break;
							}
						}
					} else {
						for ( ; i < length; ) {
							if ( callback.apply( object[ i++ ], args ) === false ) {
								break;
							}
						}
					}
				} else {
					if ( isObj ) {
						for ( name in object ) {
							if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
								break;
							}
						}
					} eles {
						for ( ; i < length; ) {
							if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
								break;
							}
						}
					}
				}
				
				return object;
			},
			//ȥ���ַ������ߵĿհ׷�
			
			//�����������
			//��������ת����������
			
			//����ָ��Ԫ�ز��������±�
			
			//�ϲ���������
			
			//����������������˺�����Ԫ��
			
			//������ǰ jQuery ������ÿ��Ԫ����ִ�лص������������ص������ķ���ֵ����һ���µ� jQuery ������
			//���������������������󡢻ص������������� jQuery �ڲ�ʹ��
			map: function( elems, callback, arg ) {
				var value, key, ret = [],
						i = 0,
						length = elems.length,
						isArray = elems instanceof jQuery
							|| length !== undefined && typeof length === 'number'
								&& ( (length > 0 && elems[0] && elems[ length-1 ]) || length === 0 || jQuery.isArray( elems ) );
				if ( isArray ) {
					for ( ; i < length; i++) {
						value = callback( elems[ i ], i, arg );
						
						//����ص������ķ���ֵ���� null �� undefined����ѷ���ֵ�������� ret
						if ( value != null ) {
							ret[ ret.length ] = value;	
						}
					}
				} else {
					for ( key in elems ) {
						value = callback( elems[ key ], key, arg );
						
						if ( value != null ) {
							ret[ ret.length ] = value;	
						}
					}
				}
				
				//��ƽ������� ret
				return ret.concat.apply( [], ret );
			}
			//ȫ�ּ�����������Ψһ��ʶ
			
			//����һ���º������������ض���������
			
			//��ȡ����������ֵ
			
			//�����������
			
			//�������̽
			
		});
		
		return jQuery;
		
	})();
	
	//���߷��� utilities
	
	//Callbacks Object �ص������б�
	
	//Deferred Object �첽����
	
	//Support ��������ܲ���
	
	//Data ���ݻ���
	
	//Queue ����
	
	//Attributes ���Բ���
	
	//Events �¼�ϵͳ
	
	//Sizzle ѡ����
	
	//Traversing Dom����
	
	//Manipulation DOM����
	
	//Css ��ʽ����
	
	//Ajax �첽����
	
	//Effects ����
	
	//Offset and Dimensions ���ꡢ�ߴ�
	
	window.jQuery = window.$ = jQuery;
})(window);


