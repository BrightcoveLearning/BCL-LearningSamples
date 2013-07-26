/*
 * UploadVideo.java
 * 
 */

import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.fileupload.*;

import java.io.*;
import java.net.*;

import java.util.Iterator;
import java.util.List;

import javax.servlet.*;
import javax.servlet.http.*;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;



/**
 *
 * @author wanbar
 */
public class UploadVideo extends HttpServlet {
   
    /** 
    * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
    * @param request servlet request
    * @param response servlet response
    */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        
    } 

    /** 
    * Handles the HTTP <code>GET</code> method.
    * @param request servlet request
    * @param response servlet response
    */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        processRequest(request, response);
    } 

    /** 
    * Handles the HTTP <code>POST</code> method.
    * @param request servlet request
    * @param response servlet response
    */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        
        PrintWriter out = response.getWriter();
                 
        try {           

            /* STEP 1. 
               Handle the incoming request from the client
             */
            
            // Request parsing using the FileUpload lib from Jakarta Commons
            // http://commons.apache.org/fileupload/
            
            // Create a factory for disk-based file items
            DiskFileItemFactory factory = new DiskFileItemFactory();
            
            // Create a new file upload handler
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setSizeMax(1000000000);
            
            // Parse the request into a list of DiskFileItems
            List items = upload.parseRequest(request);
            
            // The fields we will need for the API request
            String videoName = "";
            String videoDescription = "";
            File videoFile = null;
            String videoFilename = "";
            long videoMaxSize = 0;

            // Iterate through the list of DiskFileItems
            Iterator iter = items.iterator();  
            while (iter.hasNext()) {
                DiskFileItem item = (DiskFileItem) iter.next();

                if (item.isFormField()) {
                    
                    if (item.getFieldName().equals("name")) {
                        videoName = item.getString();
                    } else if (item.getFieldName().equals("desc")) {
                        videoDescription = item.getString();                        
                    }

                } else {
                    videoFile = item.getStoreLocation();
                    String fileName = item.getName();
                    videoMaxSize = item.getSize();

                }
            }
            
            out.print(videoFilename);
           
            
            
/* STEP 2. 
Assemble the JSON params
token is for Developer Training Account
*/

String json = "{\"method\":\"create_video\"" +
          ", \"params\":{" +
          "\"token\":" + "Jyiei-T0_tDMwct8bUns819VTkfvkt9iX2mnIfkc8GNnREmW2YTG6A.." + ", " +
          "\"video\":" + 
                "{\"name\":\"" +  videoName + "\", " +
                "\"shortDescription\":\"" + videoDescription + "\"}, " +

          "\"filename\":\"" + videoFilename + "\", " +
          "\"maxsize\":\"" + videoMaxSize + "\", " +
          "}}";

           
            /* STEP 3. 
               Send the request to the Media API
             */
            
            // Define the url to the api
            String targetURL = "http://api.brightcove.com/services/post";
            
            // Create the params object required by...
            Object[] params;
            if(videoFile == null) {
              params = new Object[] { "JSON-RPC", json };
            } else {
              params = new Object[] {
                    "JSON-RPC", json,
                    videoFilename, videoFile
                 }; 
            }              
            
            // ... the ClientHTTPRequest helper class from the ClientHTTP library by Vlad Patryshev
            // http://www.devx.com/Java/Article/17679/1954?pf=true
            
            InputStream in = ClientHttpRequest.post( new java.net.URL(targetURL), params );
            
            // Turn the input stream into a string
            int bytesRead = 0;
            byte[] buffer = new byte[1024];
            ByteArrayOutputStream ret = new ByteArrayOutputStream();
            while ((bytesRead = in.read(buffer)) > 0)
            {
              ret.write(buffer, 0, bytesRead);
            }
            
            // print the response from the API
            String resp = new String(ret.toByteArray());
            out.print(resp);
            
            
            
        } catch (FileUploadException ex) {
            Logger.getLogger(UploadVideo.class.getName()).log(Level.SEVERE, null, ex);
            
        }         
        
    }

    /** 
    * Returns a short description of the servlet.
    */
    public String getServletInfo() {
        return "Short description";
    }
}