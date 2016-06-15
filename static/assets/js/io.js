function populateFileList(mode){
    var url = '/dapp/loadfilelist';

    $.ajax({
        url: url,
        dataType: 'json',
        method: 'get',
        data: {
            mode: mode
        },
        success: function(result) {
            
            var options = '<option value="0">--Select data File--</option>';
            $.each(result.data, function(index, obj) {
                options += "<option value=" + obj + ">" + obj + "</option>";
            });
            
            $("#datafilename").html(options);
            
        }
    });
}




function displayNetworkDiagram(mode_folder, image_filename) {
    
    //file is inside result/ folder but due to static django we have to say url /static :(  ..enjoy :)
    var imgPath = "/static/" + mode_folder + "/" + image_filename ;
    $('#networkDiagram').html('<img src="' + imgPath + '" width="800" alt="Output" />');
}


function initForm() {
    
    var url = '/dapp/runinput';
    
    
    
    $("#input-form").submit(function(e) {
        
        
        e.preventDefault();
        
        
        
        var fileInput = $("#datafilename option:selected").text();
        if (fileInput == '--Select data File--' || fileInput == '') 
        {
            $("#input-file-error").show();
            return false;
        } 
        else 
        {
            $("#input-file-error").hide();
        }
        
        
        $.post( url, $('form#input-form').serialize(), function(data) {
            
            //alert(data.filename + data.mode);
            
            
            displayNetworkDiagram(data.mode, data.filename );
        },
       'json' // I expect a JSON response
    );
});


/*
    fileInput = $("#file-list option:selected").text();
    if (fileInput == '--Select data File--') {
        $("#input-file-error").show();
        return false;
    } else {
        $("#input-file-error").hide();
    }
    comInput = $("#comomodity-input-text").val();
    comOutput = $("#comomodity-output-text").val();
    colorScheme = $("input[name=qcolorscheme]:checked").val();
    outputFormat = $("#output-format").text();
    displayNetworkDiagram();
    
    //alert("hi");
    
    
    $.ajax({
        url: url,
        method: "post",
        data: {datafile:fileInput,commodityoutputlimit:comInput,commodityinputlimit:comOutput,ccolorscheme:colorScheme,format:outputFormat},
        dataType: 'json',
        success: function(result) {
            alert(result);
            displayNetworkDiagram();
        }
    });*/

}

function showHideCommodityTechnology(mode){
    
    
    
    $('#commodity-technology-type').change(function(){

        type = $('#commodity-technology-type').val();
     
        if(type == 'none')
        {
            $('#commodity-technology-value').hide();
            $('#commodity-label').hide();
        } 
        else 
        {
            
            filename = $("#datafilename").val();
            
            if(filename == 0)
            {
                alert("Select model first");
                return;
            }
            
            $('#commodity-technology-value').show();
            $('#commodity-label').html("Select "+type+" value");
            $('#commodity-label').show();
        
        
            getCTList(mode, type, filename );
        }
    });
}

function getCTList(mode, type, filename){
    var url = '/dapp/loadctlist';

    $.ajax({
        url: url,
        dataType: 'json',
        method: 'get',
        data: {
            mode: mode,
            filename: filename,
            'type':type
        },
        success: function(result) {
            
            var options = '<option value="0">--Select '+ type +' value--</option>';
            $.each(result.data, function(index, obj) {
                options += "<option value=" + obj + ">" + obj + "</option>";
            });
            
            $("#commodity-technology-value").html(options);
            
        }
    });
}


function initJs(str)
{
    initForm();
    $('#commodity-technology-value').hide();
    $('#commodity-label').hide();
    populateFileList(str);
    showHideCommodityTechnology(str);
    
    $("#input-file-error").hide();
    
    /*$("#input-form").submit(function(e) {
        e.preventDefault();
        ioFormSubmit();
    });*/
    
    
    // Dropzone class:
    var myDropzone = new Dropzone("div#dropArea", {
        url: "/dapp/fileupload",
        params: {
        mode: str
    }
    });

    myDropzone.on("success", function(fileList, response) 
    {
        
        var options = '<option value="0">--Select Input File--</option>';
        
        $.each(response.data, function(index, obj) {
            options += fileList.name == obj ? "<option selected='selected' value=" + obj + ">" + obj + "</option>" :
                "<option value=" + obj + ">" + obj + "</option>";
        });
        
        $("#datafilename").html(options);

        myDropzone.removeAllFiles();
        
        showHideCommodityTechnology(str);

    });
    
}
