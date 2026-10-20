// Read-only shared-library helpers. No secrets, uploads, permissions or database writes.
export function safeURL(value){try{const u=new URL(String(value||''));return u.protocol==='https:'?u.href:''}catch{return ''}}
export function assetKey(row,kind='material'){
 const drive=String(row.driveFileId||row.drive_file_id||'').trim();
 if(drive)return 'drive:'+drive;
 const raw=kind==='song'?(row.audioUrl||row.audio_url||row.driveUrl||row.drive_url):(row.url||row.file_url);
 const link=safeURL(raw);if(!link)return '';
 const u=new URL(link),match=u.hostname==='drive.google.com'&&u.pathname.match(/\/file\/d\/([^/]+)/);
 if(match)return 'drive:'+match[1];
 if(u.hostname==='drive.google.com'&&u.searchParams.get('id'))return 'drive:'+u.searchParams.get('id');
 if(u.hostname==='rathod-hub-audio.sanatanirambhakt73.workers.dev')return 'drive:'+decodeURIComponent(u.pathname.slice(1).replace(/\.mp3$/i,''));
 u.hash='';return 'url:'+u.href;
}
export function recordTime(row){const t=row.createdAt||row.created_at;return t?.toMillis?.()||((t?.seconds||t?._seconds)?Number(t.seconds||t._seconds)*1000:Date.parse(t)||0)}
export function mergeLibrary(mainRows=[],firebaseRows=[],kind='material'){
 const records=new Map();
 for(const row of [...mainRows,...firebaseRows]){if(kind==='song'&&row.status&&row.status!=='ready')continue;const key=assetKey(row,kind);if(!key)continue;records.set(key,{...row})}
 return [...records.values()].sort((a,b)=>recordTime(b)-recordTime(a));
}
export function mainMaterial(row){return {id:'main_'+row.id,title:row.title||row.file_name||'Study material',description:row.desc||'',subject:String(row.category||'Other'),folder:row.category==='PYQ'?'NEET PYQ':'Main HUB Uploads',type:row.file_type?.includes('pdf')?'PDF':'Material',url:safeURL(row.file_url),size:row.file_size?((Number(row.file_size)/1048576).toFixed(1)+' MB'):'Drive',createdAt:row.created_at,sourceApp:'RATHOD HUB 1.0'}}
export function catalogSubjects(base,materials){const known=new Set(base.map(x=>x.name));return [...base,...[...new Set(materials.map(x=>x.subject).filter(Boolean))].filter(name=>!known.has(name)).map(name=>({name,code:'HUB',icon:'▤',tone:'violet'}))]}
export function catalogFolders(base,materials,subject){const known=new Set(base.map(x=>x.name));return [...base,...[...new Set(materials.filter(x=>x.subject===subject).map(x=>x.folder).filter(Boolean))].filter(name=>!known.has(name)).map(name=>({name,code:'HUB',icon:'▤',note:'Published from main RATHOD HUB'}))]}
