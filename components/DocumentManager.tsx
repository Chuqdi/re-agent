'use client';

import { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { mergeSignatureIntoPdf } from '@/lib/utils/pdf';
import {
  getDocumentsByAgent,
  createDocument,
  updateDocument,
} from '@/lib/firebase/firestore';
import { getClientsByAgent } from '@/lib/firebase/firestore';
import { Document, Client } from '@/types';
import ClientForm from './ClientForm';
import { signInWithGoogle } from '@/lib/firebase/auth';

interface DocumentManagerProps {
  user: any;
}

export default function DocumentManager({ user }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(
    user?.providerData?.some((provider: any) => provider.providerId === 'google.com') || false
  );
  const signatureRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    loadData();
  }, [user.uid]);

  const loadData = async () => {
    try {
      const [docs, clientList] = await Promise.all([
        getDocumentsByAgent(user.uid),
        getClientsByAgent(user.uid),
      ]);
      setDocuments(docs);
      setClients(clientList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      setGoogleLinked(true);
    } catch (error: any) {
      console.error('Error connecting Google:', error);
      alert(error?.message || 'Failed to connect Google account.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    const documentName = prompt('Enter document name:');
    if (!documentName) return;

    const documentType = prompt('Enter document type (contract/disclosure/inspection/other):') as any;
    const clientId = prompt('Enter client ID (optional):') || undefined;

    try {
      await createDocument({
        agentId: user.uid,
        clientId,
        name: documentName,
        type: documentType || 'other',
        status: 'draft',
      });
      await loadData();
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document');
    }
  };

  const handleSignDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowSignatureModal(true);
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSaveSignature = async () => {
    if (!signatureRef.current || !selectedDocument) return;

    try {
      setUploadingPdf(true);

      // Get signature as data URL
      const signatureDataUrl = signatureRef.current.toDataURL();

      // For demo purposes, we'll create a simple PDF
      // In production, you'd fetch the actual PDF from Google Drive
      const { createSimplePdf } = await import('@/lib/utils/pdf');
      const pdfBytes = await createSimplePdf(
        `Document: ${selectedDocument.name}\n\nSigned by: ${user.displayName || user.email}\nDate: ${new Date().toLocaleString()}`
      );

      // Merge signature into PDF
      const signedPdfBytes = await mergeSignatureIntoPdf(pdfBytes, signatureDataUrl, 100, 200);

      // Upload to Google Drive via API route
      const { getAuth } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase/config');
      //const user = getAuth(auth).currentUser;
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        alert('Please sign in first');
        return;
      }
      
      const token = await firebaseUser.getIdToken();
      
      // Convert Uint8Array to Blob
      const pdfBlob = new Blob([signedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', pdfBlob, `${selectedDocument.name}_signed.pdf`);
      formData.append('fileName', `${selectedDocument.name}_signed.pdf`);
      formData.append('documentId', selectedDocument.id);
      
      // Get client's Drive folder if available
      if (selectedDocument.clientId) {
        const client = clients.find(c => c.id === selectedDocument.clientId);
        if (client?.googleDriveFolderId) {
          formData.append('folderId', client.googleDriveFolderId);
        }
      }

      const response = await fetch('/api/drive/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload PDF');
      }

      const result = await response.json();
      // Document is updated by the API route

      setShowSignatureModal(false);
      setSelectedDocument(null);
      await loadData();
    } catch (error) {
      console.error('Error signing document:', error);
      alert('Failed to sign document. Please try again.');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCreateDriveFolder = async (clientId: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) {
        alert('Client not found');
        return;
      }

      const folderName = prompt('Enter folder name:', `${client.firstName} ${client.lastName} - Documents`);
      if (!folderName) return;

      // Get auth token
      const { getAuth } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase/config');
      //const user = getAuth(auth).currentUser;
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        alert('Please sign in first');
        return;
      }
      
      const token = await firebaseUser.getIdToken();
      
      // Call API route to create Drive folder
      const response = await fetch('/api/drive/create-folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderName,
          clientId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Drive folder');
      }

      const result = await response.json();
      alert(`Successfully created folder: ${result.folder.name}`);
      
      // Reload data
      await loadData();
    } catch (error: any) {
      console.error('Error creating Drive folder:', error);
      alert(error.message || 'Failed to create Drive folder');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Document Management</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleConnectGoogle}
              disabled={googleLinked || googleLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {googleLinked ? 'Google Connected' : googleLoading ? 'Connecting...' : 'Connect Google'}
            </button>
            <button
              onClick={handleCreateDocument}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Document
            </button>
          </div>
        </div>

        {/* Clients List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Clients</h3>
            <ClientForm agentId={user.uid} onClientCreated={loadData} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium">
                  {client.firstName} {client.lastName}
                </h4>
                <p className="text-sm text-gray-600">{client.email}</p>
                {client.googleDriveFolderLink ? (
                  <a
                    href={client.googleDriveFolderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    View Drive Folder →
                  </a>
                ) : (
                  <button
                    onClick={() => handleCreateDriveFolder(client.id)}
                    className="text-sm text-blue-600 hover:underline mt-2"
                  >
                    Create Drive Folder
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Documents</h3>
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No documents yet</p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      Type: {doc.type} | Status:{' '}
                      <span
                        className={`font-semibold ${
                          doc.status === 'signed'
                            ? 'text-green-600'
                            : doc.status === 'sent'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </p>
                    {doc.signedPdfDriveFileLink && (
                      <a
                        href={doc.signedPdfDriveFileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Signed PDF →
                      </a>
                    )}
                  </div>
                  <div>
                    {doc.status === 'draft' && (
                      <button
                        onClick={() => handleSignDocument(doc)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Sign Document
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              Sign Document: {selectedDocument?.name}
            </h3>
            <div className="border-2 border-gray-300 rounded-lg mb-4">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 800,
                  height: 300,
                  className: 'signature-canvas w-full',
                }}
                backgroundColor="white"
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleClearSignature}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  setShowSignatureModal(false);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSignature}
                disabled={uploadingPdf}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {uploadingPdf ? 'Saving...' : 'Save & Sign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

