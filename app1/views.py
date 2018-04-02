from django.shortcuts import render
from django.conf import settings

import os
import shutil
import re
import textwrap

# Create your views here.


def index(request):

    # TODO DELETE AUTOMATIC 0 SELECTION
    focusPath = request.GET['path'] if 'path' in request.GET else "0"
    focusFullPath = settings.BASE_DIR+"/storage/data/"+focusPath

    focusInfo = []
    with open(focusFullPath+"/.init.noteapp",'r') as ff:
        ff.readline(); focusInfo.append(ff.readline().strip()); ff.readline()

    focusFiles = [];focusDirs = [];
    for (dirpath, dirnames, filenames) in os.walk(focusFullPath):
        focusFiles.extend(filenames); focusFiles.remove('.init.noteapp'); focusFiles.remove('.notes.noteapp')
        focusDirs.extend(dirnames)
        break

    focusDirNames = []
    for dir_x in focusDirs:
        with open(focusFullPath+"/"+dir_x+"/.init.noteapp",'r') as ff:
            ff.readline();focusDirNames.append(ff.readline().strip());ff.readline()

    focusLocations = []
    with open(focusFullPath+"/.locations.noteapp",'r') as ff:
        focusLocations = ''.join(ff.readlines())
        focusLocations = focusLocations.replace("\n","")

    # import unicodedata
    # focusDirs = list(map( (lambda x : unicodedata.normalize('NFKD', x).encode('ascii', 'ignore')), focusDirs ) )
    # GUIDE : list(map( (lambda x : unicodedata.normalize('NFKD', x).encode('ascii', 'ignore')), filenames ) )

    context = {"focusPath":focusPath,
                "focusName":focusInfo[0],
                "focusDirs":focusDirs,
                "focusDirNames":focusDirNames,
                "focusFiles":focusFiles,
                "focusLocations":focusLocations }
    return render(request, 'index.html', context)

def node(request):
    noteFilePath = request.GET['path'] + "/.notes.noteapp"
    noteFullPath = settings.BASE_DIR+"/storage/data/"+ noteFilePath

    with open(noteFullPath,'r') as ff:
        notes = ''.join(ff.readlines())

    context ={"focuspath": request.GET['path'], "notes": notes }
    return render(request, 'node.html', context)

def ajax(request):

    if 'savehtml' in request.GET and 'path' in request.GET:

        focusPath = request.GET['path']
        focusFullPath = settings.BASE_DIR + "/storage/data/" + focusPath

        with open(focusFullPath+"/.notes.noteapp",'w') as ff:
            ff.write(request.GET['savehtml'])

    elif 'addnode' in request.GET and 'path' in request.GET:
        focusPath = request.GET['path']
        focusFullPath = settings.BASE_DIR + "/storage/data/" + focusPath


        foldername = 0
        while(os.path.isdir(focusFullPath+"/"+str(foldername))):
            foldername += 1
        newnodeFullPath = focusFullPath+"/"+str(foldername)
        os.makedirs(newnodeFullPath)
        with open(newnodeFullPath+"/.init.noteapp",'w') as ff:
            ff.write("[filename]\n")
            ff.write("new node\n")
            ff.write("\n")
        with open(newnodeFullPath+"/.notes.noteapp",'w') as ff:
            ff.write("")
        with open(newnodeFullPath+"/.locations.noteapp",'w') as ff:
            ff.write(
             """[
                    {
                        "x": 0,
                        "y": 0,
                        "id": "-1"
                    }
                ]"""
            )


        with open(focusFullPath+"/.locations.noteapp" ,'r') as ff:
            locInfo = ''.join(ff.readlines())

        locInfoUpdated = re.search(r'(.+\}).+?$',locInfo,re.DOTALL).group(1)+","+textwrap.dedent("""
          {
            "x": 40,
            "y": 40,
            "id": "%d"
          }
        ]""" % (foldername) )

        with open(focusFullPath+"/.locations.noteapp" ,'w') as ff:
            ff.write(locInfoUpdated)

    elif 'deletenode' in request.GET and 'path' in request.GET:
        focusPath = request.GET['path']
        focusFullPath = settings.BASE_DIR + "/storage/data/" + focusPath

        shutil.rmtree(focusFullPath)

        ## Remove node position from parent view
        parentPath = re.search("(.+)\/.+?",focusPath).group(1)
        parentFullPath = settings.BASE_DIR + "/storage/data/" + parentPath

        with open(parentFullPath+"/.locations.noteapp" ,'r') as ff:
            locInfo = ''.join(ff.readlines())

        locregex = r'(.+)\{.+?\"id\": \"' + re.escape(focusPath[-1:]) + r'\".*?\}(.+)'
        locmatch = re.search(locregex, locInfo, re.DOTALL)
        locInfoUnfixed = locmatch.group(1) + locmatch.group(2)
        locfixcase1regex = r'\[\s+?,\n(.+)'
        locfixcase2regex = r'(.+?,)\s+?,(\n.+)'
        locfixcase1match = re.search(locfixcase1regex, locInfoUnfixed, re.DOTALL)
        locfixcase2match = re.search(locfixcase2regex, locInfoUnfixed, re.DOTALL)
        if (locfixcase2match == None):
            locInfo = "[\n" + locfixcase1match.group(1)
        elif (locfixcase1match == None):
            locInfo = locfixcase2match.group(1) + locfixcase2match.group(2)

        with open(parentFullPath+"/.locations.noteapp" ,'w') as ff:
            ff.write(locInfo)
            
    elif 'editnode' in request.GET and 'path' in request.GET and 'name' in request.GET:
        focusPath = request.GET['path']
        focusFullPath = settings.BASE_DIR + "/storage/data/" + focusPath

        newFocusName = request.GET['name']

        with open(focusFullPath+"/.init.noteapp",'r') as ff:
            initFile = ff.readline()
            initFile += newFocusName
            ff.readline()
            initFile += ''.join(ff.readlines())

        with open(focusFullPath+"/.init.noteapp",'w') as ff:
            ff.write(initFile)

    elif 'exportnetwork' in request.GET and 'path' in request.GET and 'data' in request.GET:
        focusPath = request.GET['path']
        networkData = request.GET['data']

        focusFullPath = settings.BASE_DIR + "/storage/data/" + focusPath    

        with open(focusFullPath+"/.locations.noteapp",'w') as ff:
            ff.write(networkData)


    from django.http import HttpResponse
    response = HttpResponse("Here's the text of the Web page.")
    return response
