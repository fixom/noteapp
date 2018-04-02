/**
 * Created by sahin on 5/13/17.
 */

function defineFroalaCustomButtons(){
    $.FroalaEditor.DefineIcon('addtab', {NAME: 'plus'});
    $.FroalaEditor.RegisterCommand('addtab', {
      title: 'Add tab',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        this.html.insert('My New HTML');
          console.log( $('div#froala-editor').froalaEditor('selection.blocks') );
          console.log( $('div#froala-editor').froalaEditor('selection.element') );
          console.log( $('div#froala-editor').froalaEditor('selection.get') );
      }
    });

    // <button aria-expanded="false" class="btn btn-info collapsed" data-target="#demo" data-toggle="collapse" type="button">Simple collapsible</button>
    // <div aria-expanded="false" class="collapse" id="demo" style="height: 0px;">Lorem ipsum </div>

     // $("div#froala-editor").froalaEditor("edit.off");

}
function getToolbarButtons(){
    return ['fullscreen', '|', 'bold', 'italic', 'underline','|', 'fontFamily', 'fontSize', 'align', '|', 'color', '|',
                'formatOL', 'formatUL', '|',  'outdent', 'indent', '|', 'subscript', 'superscript','|','paragraphFormat','|',
                'insertLink', 'insertImage', 'insertVideo', 'insertFile','|','clearFormatting',   '-',
                'undo', 'redo', '|' , 'addtab' ,'|','insertHR','paragraphStyle', '|',  'insertTable','html' ];
                // {#  selectAll, strikeThrough, inlineStyle, save, emoticons, quote  #}
}

$(function() {

    defineFroalaCustomButtons();

    $('div#froala-editor').froalaEditor({
        charCounterCount: false,
        quickInsertTags: [],
        heightMin: $(window).height()-200,
        heightMax: $(window).height()-200,
        toolbarButtons: getToolbarButtons(),
        toolbarButtonsMD: getToolbarButtons(),
        toolbarButtonsSM: getToolbarButtons(),
        toolbarButtonsXS: getToolbarButtons(),

        tableEditButtons: [],

        enter: $.FroalaEditor.ENTER_P, // ENTER_P, ENTER_BR, ENTER_DIV
        paragraphFormatSelection: true,
        paragraphFormat: {N: 'Normal',PRE: 'Code'}// H1: 'Heading 1', H2: 'Heading 2',

    });
});

function saveNotes(focuspath){

    // var notes = $(".ql-editor").get(0).innerHTML;

    var notes = $('div#froala-editor').froalaEditor('html.get', true);
    $.ajax({
        url: '/ajax?',
        contentType: 'application/json',
        data: {'savehtml':notes,'path':focuspath},
        dataType: 'json',
        complete: function () {
            $("#savenotesmodal").modal('show');
        },
      });
}

function navigateToNetwork(focuspath){
    window.location.href = "/index?path="+focuspath;
}

function navigateToParent(focuspath){
    var temp = focuspath.match(/(.+)\/.+?/);
    
    if(temp !=null){
        window.location.href = "/index?path="+temp[1];
    }else{
        window.location.href = "/index?path="+focuspath;
    }
}


/**
 *
 *
<nav class="navbar navbar-inverse" contenteditable="false">

	<ul class="nav navbar-nav" contenteditable="false">
		<li class="active"><a aria-expanded="true" contenteditable="false" data-toggle="tab" href="#home">Home</a></li>
		<li><a aria-expanded="false" contenteditable="false" data-toggle="tab" href="#menu1"><span>Menu 1</span></a></li>
		<li><a aria-expanded="false" contenteditable="false" data-toggle="tab" href="#menu2">Menu 2</a></li>
	</ul>
</nav>
<div class="tab-content">
	<div class="tab-pane fade active in" id="home">
		<div>My New HTML<a aria-expanded="true" class="btn btn-info" contenteditable="false" data-target="#demo" data-toggle="collapse"><span>Simple-collapsible</span></a></div><pre aria-expanded="true" class="collapse in" id="demo">em ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo c</pre></div>
	<div class="tab-pane fade" id="menu1">

		<h3>Menu 1</h3>

		<p>Some content in menu 1.</p>
	</div>
	<div class="tab-pane fade" id="menu2">
		<div class="panel-group" id="accordion">
			<div class="panel panel-default">
				<div class="panel-heading">

					<h4 class="panel-title"><a aria-expanded="false" class="collapsed" contenteditable="false" data-parent="#accordion" data-toggle="collapse" href="#collapse1">Collapsible Group 1</a></h4>
				</div>
				<div aria-expanded="false" class="panel-collapse collapse" id="collapse1" style="height: 0px;">
					<div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						<br>sdfsdfsdafads</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">

					<h4 class="panel-title"><a aria-expanded="true" contenteditable="false" data-parent="#accordion" data-toggle="collapse" href="#collapse2">Collapsible Group 2</a></h4>
				</div>
				<div aria-expanded="true" class="panel-collapse collapse in" id="collapse2">
					<div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">

					<h4 class="panel-title"><a aria-expanded="false" class="collapsed" contenteditable="false" data-parent="#accordion" data-toggle="collapse" href="#collapse3">Collapsible Group 3</a></h4>
				</div>
				<div aria-expanded="false" class="panel-collapse collapse" id="collapse3" style="height: 0px;">
					<div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
				</div>
			</div>
		</div>
	</div>
</div>

 */