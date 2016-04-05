using System;
using System.Web;
using System.IO;
using System.Web.Script.Services;
using System.Web.Services;

public partial class _Default : System.Web.UI.Page
{
    [WebMethod()]
    public static void UploadPic(string imageData)
    {
        string Pic_Path = HttpContext.Current.Server.MapPath("uploads/pictures/Picture " + DateTime.Now.ToString().Replace('.', '-').Replace(':', '-') + ".png");
        using (FileStream fs = new FileStream(Pic_Path, FileMode.Create))
        {
            using (BinaryWriter bw = new BinaryWriter(fs))
            {
                byte[] data = Convert.FromBase64String(imageData);
                bw.Write(data);
                bw.Close();
            }
        }
    }
}