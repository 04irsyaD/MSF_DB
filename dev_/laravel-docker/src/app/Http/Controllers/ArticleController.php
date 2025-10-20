<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // List all articles
    public function index()
    {
        $articles = Article::latest()->get();
        return view('articles.index', compact('articles'));
    }

    // Show create form
    public function create()
    {
        return view('articles.create');
    }

    // Store new article
   public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'pdf' => 'required|mimes:pdf|max:2048',
            'content' => 'nullable|string',
        ]);

        $pdfPath = $request->file('pdf')->store('pdfs', 'public');

        Article::create([
            'title' => $request->title,
            'content' => $request->content, // komentar opsional
            'pdf_path' => $pdfPath,
        ]);

        return redirect()->route('articles.index')->with('success', 'Artikel PDF berhasil diupload!');
    }

    // Show edit form
    public function edit(Article $article)
    {
        return view('articles.edit', compact('article'));
    }

    // Update existing article
       public function update(Request $request, Article $article)
        {
            $request->validate([
                'title' => 'required|string|max:255',
                'pdf' => 'nullable|mimes:pdf|max:2048',
                'content' => 'nullable|string',
            ]);

            $data = [
                'title' => $request->title,
                'content' => $request->content,
            ];

            if ($request->hasFile('pdf')) {
                $pdfPath = $request->file('pdf')->store('pdfs', 'public');
                $data['pdf_path'] = $pdfPath;
            }

            $article->update($data);

            return redirect()->route('articles.index')->with('success', 'Artikel PDF berhasil diperbarui!');
        }
    // Delete article
    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->route('articles.index')->with('success', 'Artikel dihapus!');
    }
}